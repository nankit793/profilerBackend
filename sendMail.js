const nodemailer = require("nodemailer");
// const MAIL_SETTINGS = {
//   service: "gmail",
//   auth: {
//     user: process.env.MAIL_EMAIL,
//     pass: process.env.MAIL_PASSWORD,
//   },
// };

// const transporter = nodemailer.createTransport(MAIL_SETTINGS);

var transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "b36587daa9e3c9",
    pass: "20343e58578a0e",
  },
});

module.exports.sendMail = async (params) => {
  try {
    let info = await transport.sendMail({
      // from: MAIL_SETTINGS.auth.user,
      to: params.to,
      subject: `${params.subject}`,
      html: `
        <div
          class="container"
          style="max-width: 90%; margin: auto; padding-top: 20px"
        >
         ${params.html}
     </div>
      `,
    });
    return info;
  } catch (error) {
    console.log(error);
    return false;
  }

  return info;
};
