import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { sendEmail } from "@/helpers/mailer";

connect();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate that only the email field is provided
    if (!body.email || typeof body.email !== "string" || Object.keys(body).length !== 1) {
      return NextResponse.json({ error: "Invalid request format. Only 'email' is allowed." }, { status: 400 });
    }

    const { email } = body;
    console.log("Email received:", email);

    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("User found:", user);

    // Generate a 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("Generated verification code:", verificationCode);

    user.forgotPasswordToken = verificationCode;
    user.forgotPasswordTokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();
    console.log("User updated with verification code");

    // Send the verification code via email
    await sendEmail({
      email: user.email,
      emailType: "RESET",
      userId: user._id.toString(),
      content: `Your password reset code is: ${verificationCode}`,
    });
    console.log("Email sent");

    return NextResponse.json({ message: "Password reset code sent to your email" });
  } catch (error: any) {
    console.error("Error in reset password generate route:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}