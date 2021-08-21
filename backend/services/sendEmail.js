const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER, // generated ethereal user
      pass: process.env.SMTP_PASSWORD, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: `"${options.senderName} 👻" <${options.senderEmail}>`, // sender address
    to: `${options.receiverEmail}`, // list of receivers
    subject: `${options.subject} ✔`, // Subject line
    // text: `Hello world?`,
    html: `${options.mailContent}`,
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
};

module.exports = sendEmail;
