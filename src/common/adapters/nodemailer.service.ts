import SMTPTransport from 'nodemailer/lib/smtp-transport';
import nodemailer from 'nodemailer';
import { SETTINGS } from '../settings';
import { TYPE_EMAIL } from '../../auth/types/auth.type';
import { injectable } from "inversify";

const smtpConfig: SMTPTransport.Options = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: SETTINGS.SMTP_EMAIL,
    pass: SETTINGS.SMTP_PASSWORD,
  },
};

@injectable()
export class NodemailerService {
  sendEmail = async (to: string, link: string, type: string = TYPE_EMAIL.REGISTRATION): Promise<void> => {
    try {
      const htmlTemplate = this.getTemplate(link, type);
      const transporter = nodemailer.createTransport(smtpConfig);
      await transporter.sendMail({
        from: SETTINGS.SMTP_EMAIL,
        to: to,
        subject: 'Activation link',
        text: '',
        html: htmlTemplate,
      });
    } catch (error) {
      throw error;
    }
  };

  getTemplate = (link: string, type: string): string => {
    let registrationHtmlTemplate = '';
    switch (type) {
      case TYPE_EMAIL.REGISTRATION :
        registrationHtmlTemplate = `<h1>Hi! Registration</h1><div><a href="${link}">Confirm</a></div>`;
        break;
      case TYPE_EMAIL.RESEND_CODE :
        registrationHtmlTemplate = `<h1>Hi! Resend CODE</h1><div><a href="${link}">Confirm</a></div>`;
        break;
      case TYPE_EMAIL.RECOVERY_CODE :
        registrationHtmlTemplate = `<h1>Hi! Recovery CODE</h1><div><a href="${link}">Confirm</a></div>`;
        break;
      default:
        registrationHtmlTemplate = '<h1>Ups... </div>';
    }

    return registrationHtmlTemplate;
  };
}