const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");

});

app.post("/", function(req, res) {
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const email = req.body.email;

  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstname,
        LNAME: lastname
      }
    }]
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us20.api.mailchimp.com/3.0/lists/49730e177f?skip_merge_validation=<SOME_BOOLEAN_VALUE>&skip_duplicate_check=<SOME_BOOLEAN_VALUE>";
  const options = {
    method: "POST",
    auth: "abhi:51f89d9cc2f43ab1f3721a4b9e0580b6-us20"
  }
  const request = https.request(url, options, function(response) {


        if (response.statusCode === 200) {
          res.sendFile( __dirname + "/success.html");
        } else {
          res.sendFile( __dirname + "/failure.html");
        }

    response.on("data", function(data) {
      console.log(JSON.parse(data));
    });

  });

  request.write(jsonData);
  request.end();

});


app.post("/failure", fuction(req, res){
  res.redirect("/");
});

app.listen( process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000");
});

//49730e177f audienceid/listid
//51f89d9cc2f43ab1f3721a4b9e0580b6-us20 mailchimp
