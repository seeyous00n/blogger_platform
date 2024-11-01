import SMTPTransport from 'nodemailer/lib/smtp-transport';
import nodemailer from 'nodemailer';
import { SETTINGS } from '../settings';

const smtpConfig: SMTPTransport.Options = {
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: SETTINGS.SMTP_EMAIL,
    pass: SETTINGS.SMTP_PASSWORD,
  },
};

class NodemailerService {
  sendEmail = async (to: string, link: string) => {
    const registrationHtmlTemplate = `<h1>Hi!</h1><div><a href="${link}">Confirm</a></div>`;
    const transporter = nodemailer.createTransport(smtpConfig);

    await transporter.sendMail({
      from: SETTINGS.SMTP_EMAIL,
      to: to,
      subject: 'Activation link',
      text: '',
      html: registrationHtmlTemplate,
    });
  };
}

export const nodemailerService = new NodemailerService();