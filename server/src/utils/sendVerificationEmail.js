import "dotenv/config";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendVerificationMail = async (user) => {
  try {
    await sgMail.send({
      to: user.email,
      from: process.env.ADMIN_EMAIL,
      subject: "Verify your email...",
      html: `<p>Hello ${user.name}, verify your email by clicking this link... </p> 
    <a href =${process.env.CLIENT_URL}/verify-email?emailToken=${user.emailToken}>Verify Your Email</a>`,
    });

    console.log("Email sent successfully!");
  } catch (error) {
    console.log("Error sending email:", error);
  }
};

export default sendVerificationMail;
