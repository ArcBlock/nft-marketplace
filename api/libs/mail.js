const nodemailer = require('nodemailer');
const getTemplate = require('./email_template');

if (!process.env.MAILGUN_USER) {
  throw new Error('Requires process.env.MAILGUN_USER to start');
}

if (!process.env.MAILGUN_PASSWORD) {
  throw new Error('Requires process.env.MAILGUN_PASSWORD to start');
}

const transporter = nodemailer.createTransport({
  host: 'smtp.mailgun.org',
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAILGUN_USER,
    pass: process.env.MAILGUN_PASSWORD,
  },
});

module.exports = {
  send({ to, subject, hi, body, buttonLink, buttonText, tip, from = 'noreply@arcblockio.cn' }) {
    const html = getTemplate({ hi, subject, body, buttonLink, buttonText, tip });
    return new Promise((resolve, reject) => {
      transporter.sendMail({ from, to, subject, html }, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  },
};
