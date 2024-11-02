import SMTPTransport from 'nodemailer/lib/smtp-transport';
import nodemailer from 'nodemailer';
import { SETTINGS } from '../settings';
import { TYPE_EMAIL } from '../../auth/types/auth.type';

const smtpConfig: SMTPTransport.Options = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: SETTINGS.SMTP_EMAIL,
    pass: SETTINGS.SMTP_PASSWORD,
  },
};

export class NodemailerService {
  private to;
  private link;
  private type;

  constructor(to: string, link: string, type: string = TYPE_EMAIL.REGISTRATION) {
    this.to = to;
    this.link = link;
    this.type = type;
  }

  sendEmail = async (): Promise<void> => {
    try {
      const htmlTemplate = this.getTemplate();
      const transporter = nodemailer.createTransport(smtpConfig);
      await transporter.sendMail({
        from: SETTINGS.SMTP_EMAIL,
        to: this.to,
        subject: 'Activation link',
        text: '',
        html: htmlTemplate,
      });
    } catch (error) {
      throw error;
    }
  };

  getTemplate = (): string => {
    let registrationHtmlTemplate = '';
    switch (this.type) {
      case TYPE_EMAIL.REGISTRATION :
        registrationHtmlTemplate = `<h1>Hi! Registration</h1><div><a href="${this.link}">Confirm</a></div>`;
        break;
      case TYPE_EMAIL.RESEND_CODE :
        registrationHtmlTemplate = `<h1>Hi! Resend CODE</h1><div><a href="${this.link}">Confirm</a></div>`;
        break;
      default:
        registrationHtmlTemplate = '<h1>Ups... </div>';
    }

    return registrationHtmlTemplate;
  };
}