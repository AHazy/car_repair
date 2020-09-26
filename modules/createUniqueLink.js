// Node modules
const crypto = require("crypto");

// Simple function to create email-specific link with random string
module.exports = recipientEmail => {
  return "http://localhost:8080/appointment_form?email=" + recipientEmail + "&id=" + crypto.randomBytes(20).toString('hex');
}
