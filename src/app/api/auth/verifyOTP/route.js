import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { phone, otp } = await request.json();

    if (!phone || !otp) {
      return NextResponse.json(
        {
          success: false,
          message: "Phone number and OTP are required",
        },
        { status: 400 }
      );
    }

    /*
      TEMPORARY DEVELOPMENT OTP

      Later this will be checked against
      an OTP stored in the database/cache.
    */

    if (otp !== "123456") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid OTP",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Phone number verified successfully",
      phone,
    });

  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "OTP verification failed",
      },
      { status: 500 }
    );
  }
}