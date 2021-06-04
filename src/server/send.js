const express = require('express');
const app = express();
const port = 3000;

// load config
require('dotenv').config();

// configure AWS
const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });

// Create SQS service client
const sqs = new AWS.SQS({
  apiVersion: '2012-11-05',
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

// ************** API routes *******************
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/send', (req, res) => {
  sendMessage();
  res.send('Successfully added message in SQS');
});

// *********************************************

const accountId = '799513362811';
const queueName = 'im-homework';

// Setup the sendMessage()
const sendMessage = () => {
  const params = {
    MessageBody: JSON.stringify({
      user_id: '1122',
      image_url: 'test_url',
      public: true,
      date: new Date().toISOString(),
    }),
    QueueUrl: `https://sqs.us-east-1.amazonaws.com/${accountId}/${queueName}`,
  };

  sqs.sendMessage(params, (err, data) => {
    if (err) {
      console.log('Error', err);
    } else {
      console.log('Successfully added message', data.MessageId);
    }
  });
};

// run the server and listen to ${port}
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
