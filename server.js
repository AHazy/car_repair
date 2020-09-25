// Node modules
const http = require('http');
const url = require('url');
const fs = require('fs');
const fsp = fs.promises;
const path = require('path');

// Project modules
const sendEmail = require('./modules/sendEmail');
const createUniqueLink = require('./modules/createUniqueLink');


var psuedoDatabase = [];    // Holds records of emails sent for tracking

const submitEmailForm = fs.readFileSync("./templates/website_templates/submit_email_form.html");                   // Homepage
const appointmentConfirmation = fs.readFileSync("./templates/website_templates/appointment_form_submitted.html");  // Appointment confirmation page

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
      const uniqueLink = createUniqueLink(q.query.email);        // Create email-specific link to send to user
      const activationEmailTemplate = fs.readFileSync(path.join(__dirname, 'templates/email_templates', 'activation_email.html'));
      const result = await sendEmail(q.query.email, 'Schedule Your Car Repair!', activationEmailTemplate, { uniqueLink });   // Send link to user's email

      psuedoDatabase.push({email: q.query.email, link: uniqueLink, submitted: false});  // Add record to pseudoDatabase

      // Email sent successfully, so let the user know to check inbox
      let body = await fsp.readFile("./templates/website_templates/email_submitted.html");
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

  // User clicks their email-specific link and is directed here
  if (q.pathname == "/appointment_form") {
    // Keep track of users email via hidden form input
    let body = await fsp.readFile("./templates/website_templates/submit_appointment_form.html");
    body = body.toString().replace('%user_email%', q.query.email);

    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(body);
    return;
  }

  // After user submits appointment form they're redirected here
  if (q.pathname == "/appointment_confirmation") {
    console.log(q.query.fname);
    // Send confirmation email to user
    const userConfirmationEmailTemplate = fs.readFileSync(path.join(__dirname, 'templates/email_templates', 'user_confirmation_email.html'));
    const userResult = await sendEmail(q.query.email, 'Repair Appointment Confirmed!', userConfirmationEmailTemplate, {});

    // Send appointment info to repairs@example.com
    const companyConfirmationEmailTemplate = fs.readFileSync(path.join(__dirname, 'templates/email_templates', 'company_confirmation_email.html'));
    const companyResult = await sendEmail(q.query.email, 'New Repair Appointment', companyConfirmationEmailTemplate,
      {
      "firstName": q.query.fname,
      "lastName": q.query.lname,
      "phoneNumber": q.query.phone,
      "vehicleYear": q.query.year,
      "vehicleMake": q.query.make,
      "vehicleModel": q.query.model,
      "repairRequired": q.query.repair,
      "dateTime": q.query.datetime,
      "ipAddress": "127.0.0"
      }
    );

    // Form submitted and emails sent succesfully, so let user know to check inbox
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(appointmentConfirmation);
    return;
  }
}).listen(8080, () => console.log('server listening'));
