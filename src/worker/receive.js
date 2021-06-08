const https = require('https');
const sharp = require('sharp');
const port = 3000;

const { Consumer } = require('sqs-consumer');
const AWS = require('aws-sdk');
const jwt = require('jwt-simple');


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

const s3 = new AWS.S3();

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
    const token = JSON.parse(message.Body).image_token;

    // resize image(s)
    doResize(token);
  },
});

const doResize = async (token) => {

  // decode the payload without verify the signature of the token
  const payload = jwt.decode(token, 'sajib', true);
  const { key, size, extensions, total } = payload;

  console.log(
    ' > size: ',
    size,
    '> extensions: ',
    extensions,
    '> total: ',
    total
  );

  const bucket = 'im-homework';
  const genKey = `${token}_`;

  for (let i = 0; i < total; i++) {
    const key = genKey + i + '.' + extensions[i];

    console.log('>>> key: ', key);
    const image = await s3.getObject({ Bucket: bucket, Key: key }).promise();

    const resizedImg = await sharp(image.Body)
    .resize(size, size)
    .toFormat(extensions[i])
    .toBuffer();

    const updated = await s3
      .putObject({
        Bucket: bucket,
        Body: resizedImg,
        Key: `${token}_${i}_resized.${extensions[i]}`,
      })
      .promise();
  }
};

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
