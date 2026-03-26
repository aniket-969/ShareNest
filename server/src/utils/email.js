import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
console.log(resend,"This is api")
export const sendEmail = async ({ to, subject, html }) => {
  try {
    const response = await resend.emails.send({
      from: "onboarding@resend.dev",
      to:"aniketbaranwal8090@gmail.com",
      subject,
      html,
    });

    return response;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error; 
  }
};

export const sendResetPasswordEmail = async (to, resetLink) => {
  
  console.log(to,resetLink)
  return sendEmail({
    to,
    subject: "Reset your password",
    html: `
      <p>You requested a password reset.</p>
      <p>Click below to reset your password:</p>
      <a href="${resetLink}">Reset Password</a>
      <p>This link will expire soon.</p>
    `,
  });
};