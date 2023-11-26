const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });
const dynamoDB = new AWS.DynamoDB.DocumentClient(); // might neeed more packages? 

const tableName = ''; // replace with my dynoDB table name

async function storeVerifiedEmail(email) {
    const params = {
        TableName: tableName,
        Item: {
            'Email': email,
            'VerifiedAt': new Date().toISOString()
        }
    };

    try {
        await dynamoDB.put(params).promise();
        console.log('Email stored successfully'); // logs 
    } catch (error) {
        console.error('Error storing email:', error);
        throw error;
    }
}

module.exports = {
    storeVerifiedEmail
};


