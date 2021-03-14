require("dotenv").config();
const express = require('express');
const hbs = require("hbs")
const path = require('path');
const nodemailer = require('nodemailer');
const PORT = process.env.PORT || 5001
const alert = require("alert");
const app = express();


// Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// View engine setup
app.set('view engine', 'hbs');


// Body Parser Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req, res) => {
  res.render('contact');
});

app.post('/send', async (req, res) => {
    const {email} =  req.body;

    const output = `
        <p>You have a new contact request form Scizers</p>
        <h3>Contact Details</h3>
        <ul>  
        <li>Name: ${req.body.name}</li>
        <li>Phone: ${req.body.phone}</li>
        </ul>
        <h3>Message</h3>
        <p>${req.body.message}</p>
    `;

    // create reusable transporter object using the default SMTP transport
    let transporter = await nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER, // generated ethereal user
            pass: process.env.SMTP_PASSWORD  // generated ethereal password
        },
        tls:{
        rejectUnauthorized:false
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Nodemailer Contact" <admin@scizers.com>', // sender address
        to: 'deepakkumarchouhan272@gmail.com', // list of receivers
        subject: 'Node Contact Request', // Subject line
        text: 'Hello Scizers', // plain text body
        html: output // html body
    };

    // send mail with defined transport object
    await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        alert('Message sent: %s', info.messageId);   
        alert('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        res.render('contact', {msg:'Email has been sent'});
    });

  });

  app.listen(PORT, ()=>{
      console.log(`Server started at port ${PORT}`)
  })