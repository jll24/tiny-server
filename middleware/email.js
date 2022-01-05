const nodemailer = require("nodemailer");
require("dotenv").config();

/**
 * sendemail - function to send an email message
 * parameter - email, htmlmessage
 * this function has no error handling capability
 * return - none
 */
const sendemail = async (email, htmlmessage) => {
  // send credentials to nodemailer
  try {
    let transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // send email
    let info = await transport.sendMail({
      from: '"Project Tiny" <foo@example.com>', // sender address
      to: email, // list of receivers
      subject: "Reset Password", // Subject line
      html: htmlmessage, // html body
    });

    console.log("Message sent: %s", info.messageId);
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = sendemail;
