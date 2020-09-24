// Node modules
const http = require('http');
const url = require('url');
const fs = require('fs');
const fsp = fs.promises;

// Project modules
const sendEmail = require('./modules/sendEmail');
const createUniqueLink = require('./modules/createUniqueLink');


var psuedoDatabase = [];    // Holds records of emails sent for tracking

const submitEmailForm = fs.readFileSync("./templates/submit_email_form.html");    // Homepage


// Create the web server
http.createServer(async function (req, res) {
  const q = url.parse(req.url, true);   // Allows us to use pieces of the URL

  // Display home page
  if (q.pathname == "/") {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(submitEmailForm);
    return;
  }

  // After an email has been submitted the user is redirected here
  if (q.pathname == "/send_email") {
    try {
      const uniqueLink = createUniqueLink(q.query.email);               // Create email-specific link to send to user
      const result = await sendEmail(q.query.email,  { uniqueLink });   // Send link to user's email

      psuedoDatabase.push({email: q.query.email, link: uniqueLink, submitted: false});  // Add record to pseudoDatabase
      console.log(psuedoDatabase);
      console.log(result);

      // Email sent successfully, so let the user know to check inbox
      let body = await fsp.readFile("./templates/email_submitted.html");
      body = body.toString().replace('%RECIPIENT_EMAIL%', q.query.email);
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end(body);
    }
    // If error, display message to user
    catch (error) {
      res.writeHead(500, {'Content-Type': 'text/html'});
      res.end(error.message);
    }
    return;
  }
}).listen(8080, () => console.log('server listening'));
