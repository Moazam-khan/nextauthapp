import { Resend } from 'resend';
import User from '@/models/userModel';
import crypto from 'crypto';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailOptions {
  email: string;
  emailType: 'VERIFY' | 'RESET';
  userId: string;
  username:string
  content?: string;
}

export const sendEmail = async ({ email, emailType, userId, content,username }: EmailOptions) => {
  try {
    const token = crypto.randomBytes(32).toString('hex');

    // Define the token expiration time
    const updateFields =
      emailType === 'VERIFY'
        ? { verifyToken: token, verifyTokenExpiry: Date.now() + 3600000 }
        : { forgotPasswordToken: token, forgotPasswordTokenExpiry: Date.now() + 3600000 };

    await User.findByIdAndUpdate(userId, updateFields);

    // Define the email subject
    const subject = emailType === 'VERIFY' ? 'Please verify your email address' : 'Password reset request';

    // Define HTML email content
    const defaultHtml = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>${subject}</h2>
        <p>Hello ${username},</p>
        <p>Click the link below to ${emailType === 'VERIFY' ? 'verify your email address' : 'reset your password'}:</p>
        <p>
          <a href="${process.env.DOMAIN}/${emailType === 'VERIFY' ? 'verifyemail' : 'resetpassword'}?token=${token}"
             style="background: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">
             ${emailType === 'VERIFY' ? 'Verify Email' : 'Reset Password'}
          </a>
        </p>
        <p>If the button doesn't work, copy and paste this URL into your browser:</p>
        <p style="color: #555;">${process.env.DOMAIN}/${emailType === 'VERIFY' ? 'verifyemail' : 'resetpassword'}?token=${token}</p>
      </div>
    `;

    // Define the plain text version of the email content
    const plainText = `
      ${subject}

      Hello ${username},
      
      Click the link below to ${emailType === 'VERIFY' ? 'verify your email address' : 'reset your password'}:
      ${process.env.DOMAIN}/${emailType === 'VERIFY' ? 'verifyemail' : 'resetpassword'}?token=${token}

      If the button doesn't work, copy and paste this URL into your browser:
      ${process.env.DOMAIN}/${emailType === 'VERIFY' ? 'verifyemail' : 'resetpassword'}?token=${token}
    `;

    // Send the email using Resend API
    const response = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'no-reply@yourdomain.com', // Ensure a recognized "From" address
      to: email,
      subject,
      text: plainText, // Send the plain text version
      html: content || defaultHtml, // Send the HTML version or custom content
    });

    console.log('Resend email response:', response);
    return response;
  } catch (error: any) {
    console.error('Resend email error:', error.message);
    throw new Error('Failed to send email via Resend');
  }
};
