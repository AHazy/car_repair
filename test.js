// Node modules
const nodemailer = require('nodemailer');

// Project modules
const sendEmail = require('./modules/sendEmail');


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
      //sendMailMock.mockClear();
      //nodemailer.createTransport.mockClear();
      nodemailer.createTransport.mockReturnValue({sendMail: sendMailMock});
  });

  test('Checks if mail was sent to correct recipient', async () => {
    const recipient = 'alechayden23@gmail.com';
    const result = await sendEmail(recipient);

    expect(sendMailMock).toBeCalled();
    expect(result.messageId).toBeDefined();
    expect(result.envelope).toBeDefined();
    expect(Array.isArray(result.envelope.to)).toBeTruthy();
    expect(result.envelope.to.includes(recipient)).toBeTruthy();
  });

  test('Checks if it will throw error if email is invalid', async () => {
    const recipient = 'non-valid-email-address';
    const result = await sendEmail(recipient);

    expect(sendMailMock).toBeCalled();
    expect(result.messageId).toBeDefined();
    expect(result.envelope).toBeDefined();
    expect(Array.isArray(result.envelope.to)).toBeTruthy();
    expect(result.envelope.to.includes(recipient)).toBeTruthy();
  });

});
