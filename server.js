const http = require('http');
const url = require('url');
const fs = require('fs');
const nodemailer = require('nodemailer');

var psuedoDatabase = [];

// Create the web server
http.createServer(function (req, res) {
  const q = url.parse(req.url, true);   // Allows us to use pieces of the URL
  //var filename = "." + q.pathname;
  //var txt = q.query.year + " " + q.query.month;

  // The initial home page
  if (q.pathname == "/"){
    fs.readFile("submit_email_form.html", function(err, data){

      if(err){
        res.writeHead(404, {'Content-Type': 'text/html'});
        return res.end("404 Not Found");
      }

      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(data);
      return res.end();
    });
  }

  // Page for after an email has been submitted
  if (q.pathname == "/send_email"){

      // Notifies the user that their email was succesfully submitted
      fs.readFile("email_submitted.html", function(err, data){
        res.writeHead(200, {'Content-Type': 'text/html'});
        return res.end(data);
      });
      sendEmail(q);
  }
}).listen(8080);

function createUniqueLink(recipientEmail){
  return "http://localhost:8080/appointment_form?email=" + recipientEmail;
}

function sendEmail(q){
  // Using gmail as the transporter for "simplicity"
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'alechayden23@gmail.com',
      pass: 'SendIt932!'
    }
  });
  const emailBody = fs.createReadStream("activation_email.html");
  const mailOptions = {
    from: 'alechayden23@gmail.com',
    to: q.query.email,
    subject: 'Schedule Your Car Repair!',
    text: 'http://localhost:8080/',
    html: emailBody
  };
  // Send email using defined transporter and mailOptions
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
    const uniqueLink = createUniqueLink(q.query.email);
    psuedoDatabase.push({email: q.query.email, link: uniqueLink, submitted: false});
    console.log(psuedoDatabase);
  });
}
