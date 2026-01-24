import { Resend } from "resend";

console.log("API key",process.env.RESEND_API_KEY)
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendTestEmail = async () => {
  try {
    const response = await resend.emails.send({
      from: "no-reply@resend.dev",
      to: ["aniketbaranwal8090@gmail.com"], 
      subject: "Resend test email",
      html: "<p>If you received this, Resend is working ✅</p>",
    });

    console.log("Email sent:", response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
