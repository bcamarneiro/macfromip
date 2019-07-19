import getMac from "./macfromip";

getMac("192.168.208.122", function(err, data) {
  if (err) {
    console.log(err);
  } else {
    console.log(data);
  }
});
