//jshint esversion:6

const bodyParser = require("body-parser");
const express = require("express");
const request = require("request");
const https = require("https");
require("dotenv").config();

const app = express();

//make use of static files
app.use(express.static("public"));
//use body-parser
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  // console.log(firstName,lastName,email);

  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  };
  const jsonData = JSON.stringify(data);

  const url = "https://us4.api.mailchimp.com/3.0/lists/" + process.env.URL_KEY;

  const options = {
    method: "POST",
    auth: process.env.API_KEY
  } //jshint ignore:line

  const request = https.request(url, options, function(response) {
if (response.statusCode === 200){
  res.sendFile(__dirname + "/public/" + "success.html");
} else {
  res.sendFile(__dirname + "/public/" + "failure.html");
}

    response.on("data", function(data) {
      //console.log(JSON.parse(data));
      console.log("statusCode: ", response.statusCode);
    });
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", function(req,res){
res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is listening local on port 3000!");
});
