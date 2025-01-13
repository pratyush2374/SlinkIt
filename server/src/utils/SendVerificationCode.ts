import nodemailer from "nodemailer";

const sendVerifyCode = async (
    name: string,
    email: string,
    verifyCode: number
) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // Set up email data
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Email Verification Code",
        text: `Hello ${name},\n\nYour verification code is: ${verifyCode}\n\nPlease use this code to complete your signup process.`, // Plain text body
    };

    // Send the email
    return transporter.sendMail(mailOptions);
};

export default sendVerifyCode;
