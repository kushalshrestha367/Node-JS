//for mail
const nodemailer = require('nodemailer')
const sendEmail = async(data) =>{
    //creating transport
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth:{
            //app password
            user: "kushalstha367@gmail.com",
            pass: "uogiehrzsbajpsou"
        }
    })
const mailOption = {
    from: "NodeJs<labirtniar@gmail.com",
    to: data.email,
    subject: data.subject,
    text: data.text
}
await transporter.sendMail(mailOption);
}

module.exports = sendEmail
