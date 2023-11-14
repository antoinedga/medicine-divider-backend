const sgMail = require('@sendgrid/mail')
const handlerBars = require("handlebars")
const fs = require('fs');

require("dotenv").config()
sgMail.setApiKey(process.env.SEND_GRID_API)

const PASSWORD_RESET_SUBJECT = "Reset Password From MedicineDivider"

function sendEmailForPasswordReset(name, email) {
    // // const source = fs.readFileSync("../resources/resetPasswordTemplate.html", 'utf8').toString();
    // const template = Handlebars.compile(source);
    // const output = template({name: name, email: email});

    const msg = {
        to: "marcellab721@icloud.com", // Change to your recipient
        from: 'an.gordonalvarez@gmail.com', // Change to your verified sender
        subject: PASSWORD_RESET_SUBJECT,
        text: "you suck eggs"
        // html: output,
    }

    sgMail
        .send(msg)
        .then((response) => {
            console.log(response[0].statusCode)
            console.log(response[0].headers)
        })
        .catch((error) => {
            console.error(error)
        })
}
sendEmailForPasswordReset("", "")


module.exports = {sendEmailForPasswordReset}
