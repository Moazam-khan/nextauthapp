// /api/auth/forgot-password.ts
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { sendEmail } from "@/helpers/mailer"; // Adjust path if different

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await sendEmail({
      email: user.email,
      emailType: "RESET",
      userId: user._id,
      username: user.username,
    });

    return NextResponse.json(
      { message: "Password reset email sent" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
