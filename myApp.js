var express = require('express');
var bodyParser = require('body-parser');

var app = express();

// app.get("/", (req, res) => {
//   console.log("Sending http response...");
//   res.send("Hello Express");
// });

// Add middleware logging
app.use("/public", express.static(__dirname + "/public"));
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${req.ip} `);
  next();
});

app.use(bodyParser.urlencoded({extended: false}));

// Serve an HTML File
app.get("/", (req, res) => {
  app.use(express.static(__dirname + "/public"));
  var absolutePath = __dirname + "/views/index.html";
  console.log(absolutePath);
  res.sendFile(absolutePath);
});

// use environment variables
app.get("/json", (req, res) => {
  console.log(`MESSAGE_STYLE: ${process.env.MESSAGE_STYLE.toLowerCase()}`);
  var stringJson = {"message": "Hello json"};
  switch(process.env.MESSAGE_STYLE.toLowerCase()){
    case "uppercase":
      stringJson.message = stringJson.message.toUpperCase();
      break;
    case "lowercase":
      stringJson.message = stringJson.message.toLowerCase();
      break;
    default:
      console.log("defaulted");
  };
  console.log(stringJson);
  res.json(stringJson);
});

// get current time
var timeNow = {};
app.get("/now", (req, res, next) => {
  timeNow = {"time": new Date().toString()};
  console.log(timeNow);
  next()
}, (req, res) => {
  res.json(timeNow);
});

// get request parameters to echo
app.get("/:word/echo", (req, res) => {
  console.log(req.params.word);
  res.json({"echo": req.params.word});
});

app.get("/name", (req, res) => {
  var fullName = {"name": `${req.query.first} ${req.query.last}`};
  console.log(fullName);
  res.json(fullName)
})

app.post("/name", (req, res) => {
  var fullName = {"name": `${req.body.first} ${req.body.last}`}
  res.json(fullName);
})

module.exports = app;
