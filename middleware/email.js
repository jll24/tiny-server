const nodemailer = require("nodemailer");
require("dotenv").config();

sendemail = async (email, htmlmessage) => {
  try {
    let transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    let info = await transport.sendMail({
      from: '"Project Tiny" <foo@example.com>', // sender address
      to: email, // list of receivers
      subject: "Forgot Email", // Subject line
      html: htmlmessage, // html body
    });

    // console log if successfull
    console.log("Message sent: %s", info.messageId);
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = sendemail;
