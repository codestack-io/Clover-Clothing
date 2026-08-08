import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json(
        {
          success: false,
          message: "Phone number is required",
        },
        { status: 400 }
      );
    }

    // Basic Bangladesh phone validation
    const cleanPhone = phone.replace(/\s+/g, "");

    if (!/^01[3-9]\d{8}$/.test(cleanPhone)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid Bangladesh phone number",
        },
        { status: 400 }
      );
    }

    /*
      TEMPORARY DEVELOPMENT OTP

      We will replace this with a real SMS provider later.
    */

    const otp = "123456";

    console.log("OTP:", otp);
    console.log("Phone:", cleanPhone);

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
      phone: cleanPhone,

      // DEVELOPMENT ONLY
      otp,
    });

  } catch (error) {
    console.error("SEND OTP ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to send OTP",
      },
      { status: 500 }
    );
  }
}