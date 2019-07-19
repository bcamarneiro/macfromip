import { IP_V4_ADDRESS_REGEX, MAC_ADDRESS_LENGTH } from "./constats";

var cp = require("child_process");
var os = require("os");

function isIpAddress(ipAddress) {
  if (!ipAddress || typeof ipAddress !== "string") {
    throw new Error("Expected a string");
  }

  /* Thanks to http://www.w3resource.com/javascript/form/ip-address-validation.php#sthash.kBJql3HS.dpuf */
  return IP_V4_ADDRESS_REGEX.test(ipAddress.trim());
}

function getOwnMacAddress(ipAddress) {
  const ifaces = os.networkInterfaces();
  const selfIps = [];

  Object.keys(ifaces).forEach(ifname => {
    ifaces[ifname].forEach(iface => {
      if (iface.family !== "IPv4") {
        // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
        return;
      }
      selfIps.push(iface);
    });
  });

  const ownMacAddress = selfIps
    .filter(({ address }) => address === ipAddress)
    .map(selfIp => selfIp.mac);

  return ownMacAddress && ownMacAddress.length ? ownMacAddress[0] : false;
}

function getMacInLinux(ipAddress, callback) {
  cp.exec("ping -c 1 " + ipAddress, (error, stdout, stderr) => {
    if (error || stderr) {
      callback(
        "IP address unreachable",
        `${error ? "exec error" : "stderr"}: ${error || stderr}`
      );
      return;
    }

    cp.exec("arp -a", function(error, stdout, stderr) {
      if (error || stderr) {
        callback(
          "IP address unreachable",
          `${error ? "exec error" : "stderr"}: ${error || stderr}`
        );
        return;
      }

      stdout = stdout
        .substring(stdout.indexOf(ipAddress) + (ipAddress.length + 5))
        .substring(MAC_ADDRESS_LENGTH, 0);

      callback(false, stdout);
      return;
    });
  });
}

function getMacInWin32(ipAddress, callback) {
  cp.exec(`ping  ${ipAddress} -n 1`, (error, stdout, stderr) => {
    if (error || stderr) {
      callback(
        "IP address unreachable",
        `${error ? "exec error" : "stderr"}: ${error || stderr}`
      );
      return;
    }

    cp.exec("arp -a", (error, stdout, stderr) => {
      if (error || stderr) {
        callback(
          "IP address unreachable",
          `${error ? "exec error" : "stderr"}: ${error || stderr}`
        );
        return;
      }

      const offset = 22 - ipAddress.length;

      stdout = stdout
        .substring(stdout.indexOf(ipAddress) + (ipAddress.length + offset))
        .substring(MAC_ADDRESS_LENGTH, 0);

      callback(false, stdout);
      return;
    });
  });
}

function getRemoteMac(ipAddress, callback) {
  switch (os.platform()) {
    case "linux":
      getMacInLinux(ipAddress, (err, mac) => callback(err, mac));
      break;

    case "win32":
      getMacInWin32(ipAddress, (err, mac) => callback(err, mac));
      break;

    case "darwin":
      getMacInLinux(ipAddress, (err, mac) => callback(err, mac));
      break;

    default:
      callback("Unsupported platform: " + os.platform(), null);
      break;
  }
}

export default function getMac(ipAddress, callback) {
  if (!isIpAddress(ipAddress)) {
    throw new Error("The value you entered is not a valid IP address");
  }

  const ownMacAddress = getOwnMacAddress(ipAddress);

  if (ownMacAddress) {
    callback(false, ownMacAddress);
  } else {
    getRemoteMac(ipAddress, callback);
  }
}
