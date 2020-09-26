// Node modules
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Project modules
const sendEmail = require('./sendEmail');

const userConfirmationEmailTemplate = fs.readFileSync(path.join(__dirname, '../templates/email_templates', 'user_confirmation_email.html'));

jest.mock('nodemailer');

describe('Testing sendEmail module', () => {
  const sendMailMock = jest.fn(function (mailOptions, callback) {
      callback(null, {
       accepted: [ mailOptions.to ],
       rejected: [],
       envelopeTime: 347,
       messageTime: 1058,
       messageSize: 539,
       response: '250 2.0.0 OK  1600976130 q4sm250702pfs.193 - gsmtp',
       envelope: { from: mailOptions.from, to: [ mailOptions.to ] },
       messageId: '<e398d69c-6d50-0078-e15b-b9b7998920f7@gmail.com>'
     });
  });

  beforeEach( () => {
      nodemailer.createTransport.mockReturnValue({sendMail: sendMailMock});
  });

  test('Checks if mail was sent to correct recipient', async () => {
    const recipient = 'car.repair.appointment@gmail.com';
    const result = await sendEmail(recipient, "emailSubject", userConfirmationEmailTemplate, { uniqueLink: 1 });

    expect(sendMailMock).toBeCalled();
    expect(result.messageId).toBeDefined();
    expect(result.envelope).toBeDefined();
    expect(Array.isArray(result.envelope.to)).toBeTruthy();
    expect(result.envelope.to.includes(recipient)).toBeTruthy();
  });
});
