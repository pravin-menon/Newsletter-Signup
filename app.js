const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
require("dotenv").config();

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
    const fName = req.body.firstName;
    const lName = req.body.lastName;
    const email = req.body.inputEmail;
    const apiKey = process.env.API_KEY;
    const audienceID = process.env.AUDIENCE_ID;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: fName,
                    LNAME: lName
                }
            }

        ]
    };

    const jsonData = JSON.stringify(data);
    const url = "https://us2.api.mailchimp.com/3.0/lists/" + audienceID;
    const options = {
        method: "POST",
        auth: process.env.AUTH_KEY
    }
    const request = https.request(url, options, function(response) {
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data", function(data) {
            // console.log(JSON.parse(data));
            // console.log(response.statusCode);
        });
    });
    
    // console.log(res.status());

    request.write(jsonData);
    request.end();
    // console.log(fName + " " + lName + " with email ID " + email + " is signing up.");
});

app.post("/failure", function(req, res) {
    res.redirect("/");
});

app.listen(3000, function() {
    console.log("Server is running on port 3000");
});