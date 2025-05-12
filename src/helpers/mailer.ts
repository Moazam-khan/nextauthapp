// Import nodemailer for sending emails via SMTP
import nodemailer from "nodemailer";

// Import User model to interact with MongoDB users collection
import User from "@/models/userModel";

// Import crypto for generating random tokens (replacing bcryptjs for URL-safe tokens)
import crypto from "crypto";

// Define parameter interface for type safety
interface EmailOptions {
  email: string; // Recipient's email address
  emailType: "VERIFY" | "RESET"; // Type of email: verification or password reset
  userId: string; // MongoDB user _id
  content?: string; // Optional custom HTML content
}

// Send email for verification or password reset using Gmail SMTP
export const sendEmail = async ({ email, emailType, userId, content }: EmailOptions) => {
  try {
    // Generate a random, URL-safe token for verification or reset
    // Uses crypto to create a 32-byte hexadecimal string (secure and suitable for URLs)
    const token = crypto.randomBytes(32).toString("hex");

    // Update user document in MongoDB based on emailType
    if (emailType === "VERIFY") {
      // Store token and 1-hour expiry for email verification
      // Uses MONGODB_URI to connect to MongoDB Atlas
      await User.findByIdAndUpdate(userId, {
        verifyToken: token,
        verifyTokenExpiry: Date.now() + 3600000, // 1 hour (3600000 ms)
      });
    } else if (emailType === "RESET") {
      // Store token and 1-hour expiry for password reset
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: token,
        forgotPasswordTokenExpiry: Date.now() + 3600000, // 1 hour
      });
    }

    // Create nodemailer transport for Gmail SMTP
    const transport = nodemailer.createTransport({
      host: "smtp.gmail.com", // Gmail SMTP server address
      port: 587, // Recommended port for TLS (secure and modern)[](https://mailtrap.io/blog/gmail-smtp/)
      secure: false, // Use TLS (STARTTLS) instead of SSL; secure is true for port 465
      auth: {
        user: process.env.EMAIL_USER, // Gmail address from .env (e.g., moazamkhan8999@gmail.com)
        pass: process.env.EMAIL_PASS, // App Password from .env (not Gmail password)
      },
    });

    // Define email options (sender, recipient, subject, and HTML content)
    const mailOptions = {
      from: process.env.EMAIL_FROM, // Sender email (e.g., moazamkhan8999@gmail.com)
      to: email, // Recipient email (passed as parameter)
      subject: 
        // Set subject based on emailType
        emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html: 
        // Use custom content or default HTML with a clickable link
        content || `
          <p>Click <a href="${process.env.DOMAIN}/${
            emailType === "VERIFY" ? "verifyemail" : "resetpassword"
          }?token=${token}">here</a> to ${
            emailType === "VERIFY" ? "verify your email" : "reset your password"
          }
          or copy and paste the link below: <br>
          ${process.env.DOMAIN}/${
            emailType === "VERIFY" ? "verifyemail" : "resetpassword"
          }?token=${token}
          </p>
        `,
    };

    // Send the email using Gmail SMTP and return the response
    // Response includes message ID and status for debugging
    const mailResponse = await transport.sendMail(mailOptions);
    return mailResponse;
  } catch (error: any) {
    // Log and rethrow error for debugging (e.g., SMTP failure, MongoDB error)
    console.error("Email sending failed:", error.message);
    throw new Error("Failed to send email");
  }
};