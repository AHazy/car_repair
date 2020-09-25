// Node modules
const crypto = require("crypto");

// Simple function to create email-specific link to send to user
module.exports = recipientEmail => {
  return "http://localhost:8080/appointment_form?email=" + recipientEmail + "&id=" + crypto.randomBytes(20).toString('hex');
}
