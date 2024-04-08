// email.js
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);
// console.log(resend);
const sendEmail = async (subject, html) => {
  try {
    const { data, error } = await resend.emails.send({
      // from: process.env.RESEND_SENDER_EMAIL,
      from: "Acme <onboarding@resend.dev>",
      to: ["delivered@resend.dev"],
      subject,
      html,
    });

    if (error) {
      console.error("Error sending email:", error);
      throw new Error(error);
    }

    console.log("Email sent successfully:", data);
    return data;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Error sending email");
  }
};

module.exports = { sendEmail };
