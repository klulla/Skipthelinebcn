import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailData {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async (emailData: EmailData) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'SkipTheLine Barcelona <noreply@skipthelinebcn.com>',
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html,
    });

    if (error) {
      console.error('Email send error:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}; 