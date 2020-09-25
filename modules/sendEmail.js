// Node modules
const path = require('path');
const fs = require('fs');

// Third party modules
const nodemailer = require('nodemailer');


function sendEmail(recipient, emailSubject, emailTemplate, data = {}) {
  return new Promise((resolve, reject) => {
    // Replace email template with unique keys
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

    // To, from, content
    const mailOptions = {
      from: 'alechayden23@gmail.com',
      to: recipient,
      subject: emailSubject,
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
