const https = require('https');
const port = 3000;

const { Consumer } = require('sqs-consumer');
const AWS = require('aws-sdk');

// load config
require('dotenv').config();

const awsKeys = {
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
};

// Set the region
AWS.config.update({
  region: 'us-east-1',
  ...awsKeys,
});

const accountId = '799513362811';
const queueName = 'im-homework';
const queueUrl = `https://sqs.us-east-1.amazonaws.com/${accountId}/${queueName}`;

const app = Consumer.create({
  queueUrl,
  sqs: new AWS.SQS({
    apiVersion: '2012-11-05',
    httpOptions: {
      agent: new https.Agent({
        keepAlive: true,
      }),
    },
  }),
  handleMessage: async (message) => {
    // do some work with `message`
    console.log('>>> message: ', message.Body);
  },
});

// Create SQS service object
// const sqs = new AWS.SQS({
//   apiVersion: '2012-11-05',
// });

// Replace with your accountid and the queue name you setup

// Setup the receiveMessage parameters
// const params = {
//   QueueUrl: queueUrl,
//   MaxNumberOfMessages: 1,
//   VisibilityTimeout: 0,
//   WaitTimeSeconds: 0,
// };

// sqs.receiveMessage(params, (err, data) => {
//   console.log('>>> inside receiveMessage');
//   if (err) {
//     console.log(err, err.stack);
//   } else {
//     if (!data.Messages) {
//       console.log('Nothing to process');
//       return;
//     }

//     const orderData = JSON.parse(data.Messages[0].Body);
//     console.log('Order received', orderData);

//     // orderData is now an object that contains order_id and date properties
//     // Lookup order data from data storage
//     // Execute billing for order
//     // Update data storage

//     // Now we must delete the message so we don't handle it again
//     const deleteParams = {
//       QueueUrl: queueUrl,
//       ReceiptHandle: data.Messages[0].ReceiptHandle,
//     };
//     sqs.deleteMessage(deleteParams, (err, data) => {
//       if (err) {
//         console.log(err, err.stack);
//       } else {
//         console.log('Successfully deleted message from queue');
//       }
//     });
//   }
// });

app.on('error', (err) => {
  console.error(err.message);
});

app.on('processing_error', (err) => {
  console.error(err.message);
});

app.start();
