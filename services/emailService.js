import nodemailer from "nodemailer";

export const sendOTPEmail = async (email, otp) => {

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,   // email address
      pass: process.env.EMAIL_PASS    // app password
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify your email",
    html: `<h2>Your OTP is: <b>${otp}</b></h2>`
  };
  console.log("Sending OTP email to", email);
  await transporter.sendMail(mailOptions);
//   return { success: true, message: "OTP email sent" };

};