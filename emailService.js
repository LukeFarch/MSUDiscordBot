const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });

const ses = new AWS.SES();

function generateVerificationCode() {
    // define the lnegth of the code 
    const codeLength =5;
    // generate a random number and pad if need be
    const verificationCode = Math.floor(Math.random() * Math.pow(10, codeLength)).toString().padStart(codeLength, '0');
    return verificationCode;
}

async function sendVerificationEmail(emailAddress, verificationCode) {
    const params = {
        Source: '', // replace with my SES EMAIL 
        Destination: {
            ToAddresses: [emailAddress]
        },
        Message: {
            Body: {
                Text: {
                    Data: `Your verification code is: ${verificationCode}`
                }
            },
            Subject: {
                Data: 'Verification Code to access the server'
            }
        }
    };

    try {
        await ses.sendEmail(params).promise();
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error); // side logs 
    }
}

module.exports = {
    generateVerificationCode,
    sendVerificationEmail
};
