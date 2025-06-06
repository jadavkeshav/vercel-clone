const nodemailer = require('nodemailer');
const path = require('path');
const ejs = require('ejs');
require('dotenv').config();


const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});


const sendmail = async (email, subject, templateName, content) => {
    try {
        const templatePath = path.join(__dirname, '..', 'views', templateName);
        const html = await ejs.renderFile(templatePath, { ...content });

        const mailOptions = {
            from: 'DevManage999@gmail.com',
            to: email,
            subject: subject,
            html,
        };

        return transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = { sendmail };