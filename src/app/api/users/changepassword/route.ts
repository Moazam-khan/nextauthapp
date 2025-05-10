import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { oldPassword, newPassword, confirmNewPassword } = reqBody;

    // Extract token from Authorization header
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }

    let userId;
    try {
      // Verify and decode the token
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET!);
      console.log("Decoded Token:", decoded);
      userId = (decoded as any).id; // Extract user ID from the token payload
    } catch (error) {
      console.error("Token Verification Error:", error);
      return NextResponse.json(
        { error: "Unauthorized: Invalid token" },
        { status: 401 }
      );
    }

    // Validate input
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (newPassword !== confirmNewPassword) {
      return NextResponse.json(
        { error: "New password and confirm password do not match" },
        { status: 400 }
      );
    }

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Compare the old password with the stored password
    const isPasswordMatch = await bcryptjs.compare(oldPassword, user.password);

    if (!isPasswordMatch) {
      return NextResponse.json(
        { error: "Old password is incorrect" },
        { status: 400 }
      );
    }

    // Hash the new password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(newPassword, salt);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    return NextResponse.json({
      message: "Password changed successfully",
      success: true,
    });
  } catch (error: any) {
    console.error("Error in changepassword route:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}