// Node modules
const http = require('http');
const url = require('url');
const fs = require('fs');
const fsp = fs.promises;
const path = require('path');

// Project modules
const sendEmail = require('./modules/sendEmail');
const createUniqueLink = require('./modules/createUniqueLink');


var pseudoDatabase = [];    // Holds records of emails sent for tracking
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

      pseudoDatabase.push({ email: q.query.email,   // Add record to pseudoDatabase
                            link: uniqueLink,
                            submitted: false,
                            review: null,
                            firstName: null,
                            lastName: null,
                            phoneNumber: null,
                            vehicleYear: null,
                            vehicleMake: null,
                            vehicleModel: null,
                            repairRequired: null,
                            date: null,
                            time: null });

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
    // Check if user has already submitted form at their unique link
    let record = pseudoDatabase.find(r => r.link === 'http://localhost:8080/appointment_form?email=' + q.query.email + '&id=' + q.query.id);
    if (record['submitted'] === true) {
      const data = {
        "firstName": record['firstName'],
        "lastName": record['lastName'],
        "phoneNumber": record['phoneNumber'],
        "vehicleYear": record['vehicleYear'],
        "vehicleMake": record['vehicleMake'],
        "vehicleModel": record['vehicleModel'],
        "repairRequired": record['repairRequired'],
        "date": record['date'],
        "time": record['time']
      };
      const alreadySubmittedFormTemplate = fs.readFileSync(path.join(__dirname, 'templates/website_templates', 'already_submitted_form.html'));
      let body = alreadySubmittedFormTemplate.toString();
      Object.keys(data).forEach(key => {
        body = body.split('%'+key+'%').join(data[key]);
      });
      // Return a page saying they have already submitted the form
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end(body);

      return;
    }

    // Keep track of users email, uniqueLink, and ip address via hidden form input
    let body = await fsp.readFile("./templates/website_templates/submit_appointment_form.html");
    body = body.toString().replace('%user_email%', q.query.email);
    body = body.replace('%unique_link%', q.query.id);
    body = body.replace('%ip_address%', req.connection.remoteAddress);

    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(body);
    return;
  }

  // After user submits appointment form they're redirected here
  if (q.pathname == "/appointment_confirmation") {
    // Add appointment details to existing record in the pseudoDatabase
    let record = pseudoDatabase.find(r => r.link === 'http://localhost:8080/appointment_form?email=' + q.query.email + '&id=' + q.query.id);
    record['submitted'] = true;
    record['firstName'] = q.query.fname;
    record['lastName'] = q.query.lname;
    record['phoneNumber'] = q.query.phone;
    record['vehicleYear'] = q.query.year;
    record['vehicleMake'] = q.query.make;
    record['vehicleModel'] = q.query.model;
    record['repairRequired'] = q.query.repair;
    record['date'] = q.query.date;
    record['time'] = q.query.time;

    // Send confirmation email to user
    const userConfirmationEmailTemplate = fs.readFileSync(path.join(__dirname, 'templates/email_templates', 'user_confirmation_email.html'));
    const userResult = await sendEmail(q.query.email, 'Repair Appointment Confirmed!', userConfirmationEmailTemplate,
    {
      "firstName": q.query.fname,
      "lastName": q.query.lname,
      "phoneNumber": q.query.phone,
      "vehicleYear": q.query.year,
      "vehicleMake": q.query.make,
      "vehicleModel": q.query.model,
      "repairRequired": q.query.repair,
      "date": q.query.date,
      "time": q.query.time
    });

    // Send appointment info to repairs@example.com
    const companyConfirmationEmailTemplate = fs.readFileSync(path.join(__dirname, 'templates/email_templates', 'company_confirmation_email.html'));
    const companyResult = await sendEmail(q.query.email, 'Car Repair Appointment', companyConfirmationEmailTemplate,
    {
    "firstName": q.query.fname,
    "lastName": q.query.lname,
    "phoneNumber": q.query.phone,
    "vehicleYear": q.query.year,
    "vehicleMake": q.query.make,
    "vehicleModel": q.query.model,
    "repairRequired": q.query.repair,
    "date": q.query.date,
    "time": q.query.time,
    "ipAddress": q.query.ip
    });

    // Form submitted and emails sent succesfully, so let user know to check inbox
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(appointmentConfirmation);
    return;
  }
}).listen(8080, () => console.log('server listening'));
