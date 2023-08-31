import nodemailer from "nodemailer";
import Mailgen from "mailgen";

import ENV from "../config.js";

let nodeConfig = {
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // true for 465, false for others ports
  auth: {
    user: ENV.EMIAL, // GENERATE ETHEREAL USER
    pass: ENV.PASSWORD, // GENERATE ETHEREAL PASSWORD
  },
};

let transporter = nodemailer.createTransport(nodeConfig);

let MailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "Mailgen",
    link: "https://mailgen.js/",
  },
});

/** POST registerMail */
export const registerMail = async (req, res) => {
  const { username, userEmail, text, subject } = req.body;

  //body of the email
  var emial = {
    body: {
      name: username,
      intro: text || "Punit sharma here this is for testing the mailgen",
      outro: "Need help? Just reply to this mail.",
    },
  };

  let emailBody = MailGenerator.generate(emial);
  let message = {
    from: ENV.EMIAL,
    to: userEmail,
    subject: subject || "signup successful",
    html: emailBody,
  };

  // send mail
  transporter
    .sendMail(message)
    .then(() => {
      return res
        .status(200)
        .send({ msg: "Please Check Your Emial Received From Us." });
    })
    .catch((Error) => res.status(500).send({ error }));
};
