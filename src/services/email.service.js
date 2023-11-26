const nodemailer = require('nodemailer');
const config = require('../config/config');
const logger = require('../config/logger');
const { User } = require('../models/user.model');
const { convertTemplateToMessage, getMessageTemplateByTitle } = require('./message_template.service');
const { VerifyEmailMessage, ResetPasswordMessage } = require('../utils/MessageTemplates');

const transport = nodemailer.createTransport(config.email.smtp);
/* istanbul ignore next */
if (config.env !== 'test') {
  transport
    .verify()
    .then(() => logger.info('Connected to email server'))
    .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
}

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */
const sendEmail = async (to, subject, text) => {
  // Resolve the subject and text promises
  const resolvedSubject = await subject;
  const resolvedText = await text;

  try {
    const msg = { from: config.email.from, to, subject: resolvedSubject, html: resolvedText };
    await transport.sendMail(msg);
  } catch (error) {
    logger.info(error);
  }
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendResetPasswordEmail = async (to, token) => {
  // get email template
  const {
    dataValues: { emailSubject, emailBody },
  } = await getMessageTemplateByTitle('Reset_Password');

  // get user information
  const user = await User.findOne({ where: { email: to } });
  // replace the placeholders with the actual values
  const text = await convertTemplateToMessage(emailBody, {
    firstName: user.dataValues.firstName,
    token,
  });

  await sendEmail(to, emailSubject, ResetPasswordMessage(text));
};

/**
 * Send verification email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendVerificationEmail = async (to, token) => {
  const subject = 'Email Verification';
  // replace this url with the link to the email verification page of your front-end app
  const verificationEmailUrl = `http://localhost:3000/auth/register/verify-email?token=${token}`;
  const text = VerifyEmailMessage(verificationEmailUrl);
  await sendEmail(to, subject, text);
};

/**
 * send bulk emails
 * @param {Object[]} data
 * @param {string} data[].email
 * @param {string} data[].message
 * @param {string} data[].subject
 * @returns {Promise}
 */
const sendBulkEmails = async (data) => {
  return Promise.all(
    data.map(async (item) => {
      await sendEmail(item.email, item.subject, item.message);
    })
  );
};

module.exports = {
  transport,
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
  sendBulkEmails,
};
