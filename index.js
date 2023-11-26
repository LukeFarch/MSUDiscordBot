const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });
const emailService = require('./emailService');
const nacl = require('tweetnacl'); // Required for Discord verification
const ses = new AWS.SES();

const PUBLIC_KEY = process.env.PUBLIC_KEY; // Ensure this is set in your environment variables
const DISCORD_TOKEN = process.env.DISCORD_TOKEN; // Ensure this is set in your environment variables
const verificationChannelId = process.env.DISCORD_TOKEN; // eensure this is set in env varaibles 
async function verifyDiscordRequest(body, signature, timestamp) {
    // Verifying Discord signature
    return nacl.sign.detached.verify(
        Buffer.from(timestamp + body),
        Buffer.from(signature, 'hex'),
        Buffer.from(PUBLIC_KEY, 'hex')
    );
}


exports.handler = async (event) => {
    // Verify Discord request
    const timestamp = event.headers['x-signature-timestamp'];
    const signature = event.headers['x-signature-ed25519'];
    const body = event.body;
    const isVerified = await verifyDiscordRequest(body, signature, timestamp);

    if (!isVerified) {
        return { statusCode: 401, body: 'invalid request signature' };
    }

    const parsedBody = JSON.parse(body);
    // ...
    // Additional logic for handling Discord events 
    // ...

    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Response processed' })
    };
};



exports.handler = async (event) => {
    try {
        // Assuming event contains the Discord message
        const discordMessage = JSON.parse(event.body).message;
        const userEmail = extractEmail(discordMessage);

        if (!isValidEmail(userEmail) || !isSchoolEmail(userEmail)) {
            return respondToDiscord('Invalid or non-school email address.');
        }

        const verificationCode = emailService.generateVerificationCode();
        await emailService.sendVerificationEmail(userEmail, verificationCode);

        return respondToDiscord('Verification email sent. Please check your inbox.');
    } catch (error) {
        console.error('Error:', error);
        // Handle errors appropriately
    }
};

function extractEmail(message) {
    // Implement logic to extract email from the message
    // Regex can be used for email extraction
}

function isSchoolEmail(email) {
   return email.endsWith('.edu');
}


async function respondToDiscord(channelId, message) {
    try {
        await axios.post(`https://discord.com/api/v10/channels/${channelId}/messages`, { // replace with channel id 
            content: message // 
        }, {
            headers: {
                'Authorization': `Bot ${DISCORD_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error responding to Discord:', error);
    }
}