// // const nodemailer = require("nodemailer");
// const { MailtrapClient } = require("mailtrap");
// // const MAIL_SETTINGS = {
// //   service: "gmail",
// //   auth: {
// //     user: process.env.MAIL_EMAIL,
// //     pass: process.env.MAIL_PASSWORD,
// //   },
// // };

// // const transporter = nodemailer.createTransport(MAIL_SETTINGS);

// var transport = nodemailer.createTransport({
//   host: "live.smtp.mailtrap.io",
//   port: 587,
//   auth: {
//     user: "api",
//     pass: "20343e58578a0e",
//   },
// });

// module.exports.sendMail = async (params) => {
//   try {
//     let info = await transport.sendMail({
//       // from: MAIL_SETTINGS.auth.user,
//       to: params.to,
//       subject: `${params.subject}`,
//       html: `
//         <div
//           class="container"
//           style="max-width: 90%; margin: auto; padding-top: 20px"
//         >
//          ${params.html}
//      </div>
//       `,
//     });
//     return info;
//   } catch (error) {
//     console.log(error);
//     return false;
//   }

//   return info;
// };

const { MailtrapClient } = require("mailtrap");

const TOKEN = "ebd00414d06aa10b8f10010cae80800b";
const ENDPOINT = "https://send.api.mailtrap.io/";

const client = new MailtrapClient({ endpoint: ENDPOINT, token: TOKEN });

module.exports.sendMail = (params) => {
  const sender = {
    email: "mailtrap@ankitnegi.co.in",
    name: "Improfile",
  };
  const recipients = [
    {
      email: params.to,
    },
  ];

  const sent = client
    .send({
      from: sender,
      to: recipients,
      subject: params.subject,
      text: params.html,
      category: "testing",
    })
    .then(console.log, console.error);
  return client;
};
