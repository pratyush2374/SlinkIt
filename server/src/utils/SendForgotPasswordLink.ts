import nodemailer from "nodemailer";

const sendForgotPasswordLink = async (
    email: string,
    forgotPasswordLink: string
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
        subject: "Password Reset Link",
        text: `Hello,\n\nPlease click the following link to reset your password: ${forgotPasswordLink}\n\nIf you did not request this, please ignore this email.`,
    };

    // Send the email
    return transporter.sendMail(mailOptions);
};

export default sendForgotPasswordLink;
