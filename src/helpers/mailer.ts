import { Resend } from "resend";
import User from "@/models/userModel";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailOptions {
  email: string;
  emailType: "VERIFY" | "RESET";
  userId: string;
  username: string;
  content?: string;
}

export const sendEmail = async ({
  email,
  emailType,
  userId,
  content,
  username,
}: EmailOptions) => {
  try {
    const token = crypto.randomBytes(32).toString("hex");

    // Define the token expiration time
    const updateFields =
      emailType === "VERIFY"
        ? { verifyToken: token, verifyTokenExpiry: Date.now() + 3600000 }
        : {
            forgotPasswordToken: token,
            forgotPasswordTokenExpiry: Date.now() + 3600000,
          };

    await User.findByIdAndUpdate(userId, updateFields);

    // Define the email subject
    const subject =
      emailType === "VERIFY"
        ? "Please verify your email address"
        : "Password reset request";

    // Define HTML email content
    const defaultHtml = `
      <div style="font-family: Arial, sans-serif; color: #333;">
    <h2>${subject}</h2>
    <p>Hello ${username},</p>
    <p>Use the following token to ${emailType === "VERIFY" ? "verify your email address" : "reset your password"}:</p>
    <p style="font-size: 18px; font-weight: bold; color: #007BFF;">${token}</p>
    <p>This token will expire in 1 hour.</p>
  </div>
    `;

    // Define the plain text version of the email content
    const plainText = `
       ${subject}

    Hello ${username},

    Use the following token to ${emailType === "VERIFY" ? "verify your email address" : "reset your password"}:

    TOKEN: ${token}

    This token is valid for 1 hour.
    `;

    // Send the email using Resend API
    const response = await resend.emails.send({
      from: process.env.EMAIL_FROM || "no-reply@yourdomain.com", // Ensure a recognized "From" address
      to: email,
      subject,
      text: plainText, // Send the plain text version
      html: content || defaultHtml, // Send the HTML version or custom content
    });

    console.log("Resend email response:", response);
    return response;
  } catch (error) {
   console.log(error);
   
    throw new Error("Failed to send email via Resend");
  }
};
