// Node modules
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');

const emailTemplate = fs.readFileSync(path.join(__dirname, '..', 'templates', 'activation_email.html'));

function sendEmail(recipient, data = {}) {
  return new Promise((resolve, reject) => {
    // Replace template placeholder with unique link
    let emailBody = emailTemplate.toString();
    Object.keys(data).forEach(key => {
      emailBody = emailBody.split('%'+key+'%').join(data[key]);
    });

    // Transporter is the object that sends mail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'alechayden23@gmail.com',
        pass: 'SendIt932!'
      }
    });

    const mailOptions = {
      from: 'alechayden23@gmail.com',
      to: recipient,    //q.query.email,
      subject: 'Schedule Your Car Repair!',
      html: emailBody
    };

    // Send email using defined transporter and mailOptions
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return reject(error);
      }
      // Email sent successfully
      console.log('Message sent: %s', info.messageId);
      resolve(info);
    });
  });
}

module.exports = sendEmail;
