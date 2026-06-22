import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { name, email, company, subject, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 });
    }

    const emailPass = process.env.EMAIL_PASS;
    const emailUser = process.env.EMAIL_USER || "atanuaman25@gmail.com";
    const emailSubject = subject ? `[Kairo AI] ${subject}` : `[Kairo AI] New message from ${name}`;

    if (!emailPass) {
      console.log("=== CONTACT FORM SUBMISSION (SMTP Not Configured) ===");
      console.log(`From: ${name} (${email})`);
      console.log(`Company: ${company || "N/A"}`);
      console.log(`Subject: ${subject || "N/A"}`);
      console.log(`Message: ${message}`);
      console.log("====================================================");
      return NextResponse.json({ message: "Message received and logged to console." });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    const mailOptions = {
      from: `"${name}" <${emailUser}>`,
      replyTo: email,
      to: "atanuaman25@gmail.com",
      subject: emailSubject,
      text: `Name: ${name}\nEmail: ${email}\nCompany: ${company || "N/A"}\nSubject: ${subject || "N/A"}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f9f9f7; border-radius: 12px;">
          <h2 style="color: #1C1C1A; margin-bottom: 20px; border-bottom: 2px solid #C5E3C6; padding-bottom: 12px;">New Contact Form Message</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr><td style="padding: 8px 0; color: #6b7280; font-size: 13px; width: 100px;">Name</td><td style="padding: 8px 0; font-weight: 600; color: #1C1C1A;">${name}</td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280; font-size: 13px;">Email</td><td style="padding: 8px 0; font-weight: 600; color: #1C1C1A;"><a href="mailto:${email}" style="color: #2D7A31;">${email}</a></td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280; font-size: 13px;">Company</td><td style="padding: 8px 0; color: #1C1C1A;">${company || "—"}</td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280; font-size: 13px;">Subject</td><td style="padding: 8px 0; color: #1C1C1A;">${subject || "—"}</td></tr>
          </table>
          <div style="background: white; border-radius: 8px; padding: 16px; border: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 12px; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600;">Message</p>
            <p style="color: #1C1C1A; white-space: pre-wrap; margin: 0; line-height: 1.6;">${message.replace(/\n/g, "<br/>")}</p>
          </div>
          <p style="font-size: 11px; color: #9ca3af; margin-top: 20px; text-align: center;">Sent via Kairo AI Contact Form</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "Email sent successfully" });
  } catch (error: any) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email.", details: error.message },
      { status: 500 }
    );
  }
}
