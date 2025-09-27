import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

export interface MailOptions {
  from?: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

@Injectable()
export class EmailsService {
  async sendMail(options: MailOptions): Promise<void> {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const defaultFrom =
      process.env.MAIL_FROM ?? process.env.SMTP_USER ?? 'no-reply@example.com';
    const mailOptions = { ...options, from: options.from ?? defaultFrom };

    try {
      await transporter.sendMail(mailOptions as any);
    } catch (error) {
      console.error('Error sending email', error);
    }
  }
}
