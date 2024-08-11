require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 8000;

app.use(cors({
    // origin: 'https://wattscreates.com', 
    origin: 'http://localhost:3000', 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/send-email', async (req, res) => {
    console.log(req.body)
    const { firstName, lastName, email, phoneNumber, message } = req.body;
    console.log(req.body)

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        secure: false,
        secureConnection: false,
        port: 587, 
        tls: {
            ciphers:'SSLv3'
        },
        requireTLS:true,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD
        },
        tls: {
            rejectUnauthorized: false 
        }
    });
    


    const mailOptions = {
        from: ' "Fallon Watts" <create@wattscreates.com>',
        to: `${email}`,
        subject: 'Thank you for contacting us!',
        text: `Hello ${firstName}, thank you for your message! I will reach back to soon!`,
        html: `<b>Hello ${firstName}</b>, <br>Thank you for your message!<br> <br> I will reach back to soon!`
    };

    transporter.sendMail(mailOptions).catch(error => {
        if (error) {
            console.error('Failed to send email:', error);
            return res.status(500).send({ msg: 'Failed to send email', error: error.message });
        } else {
            console.log('Email sent: ' + info.response);
            res.status(200).send({ msg: 'Email sent successfully', info: info.response });
        }
    });

    const detailSend = {
        from: '"Watts Creates Learning" <create@wattscreates.com>',
        to: 'create@wattscreates.com',
        subject: `New contact form submission from ${firstName} ${lastName}`,
        text: `Message from ${firstName} ${lastName} \n${firstName}'s Email: ${email} \n${firstName}'s Phone: ${phoneNumber} \nMessage: ${message}`,
    };

    transporter.sendMail(detailSend);
});

app.get('/', (req, res) => {
    res.json({ message: 'server is up and running AND api is working perfectly' });
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`)
});