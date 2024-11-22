const nodemailer = require("nodemailer");
const nodemailerSendgrid = require("nodemailer-sendgrid");

const transporter = nodemailer.createTransport(
    nodemailerSendgrid({
        apiKey: process.env.SENDGRID_API_KEY, 
    })
);

// Email sending logic
const sendEmail = async (req, res) => {
    const { userEmail, userName, subject, message, renderUrl } = req.body;

    if (!userEmail || !userName || !message) {
        return res.status(400).send("All fields are required.");
    }

    try {
        const mailOptions = {
            from: process.env.SALES_EMAIL,
            to: process.env.SALES_EMAIL,
            subject: `Message from ${userName}: ${subject}`,
            html: `
                <h1>New Contact Request</h1>
                <p><strong>Name:</strong> ${userName}</p>
                <p><strong>Email:</strong> ${userEmail}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
                <br />
                <p><strong>Selected Render:</strong></p>
                <img src="${renderUrl}" alt="Selected Render" style="max-width: 500px; height: auto;" />
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info);
        res.status(200).send("Email sent successfully.");
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).send("Failed to send email.");
    }
};

module.exports = { sendEmail };
