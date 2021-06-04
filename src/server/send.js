const express = require('express');
const app = express();
const multer = require('multer');
var multerS3 = require('multer-s3');
const jwt = require('jwt-simple');

const helpers = require('./helpers');

const port = 3001;

// load config
require('dotenv').config();

// allow cors for all routes
const cors = require('cors');
app.use(cors());

// configure AWS
const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });

const AwsKeys = {
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
};

// Create SQS service client
const sqs = new AWS.SQS({
  apiVersion: '2012-11-05',
  ...AwsKeys,
});

// ***** to save the files in disk *****
// const diskStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/');
//   },

//   filename: function (req, file, cb) {
//     const { fieldname, originalname } = file;
//     cb(null, `${originalname}`);
//   },
// });

// s3 instance
const s3 = new AWS.S3({
  ...AwsKeys,
});

// store in S3 bucket
const s3Storage = multerS3({
  s3: s3,
  bucket: 'im-homework',
  public: 'yes',
  metadata: function (req, file, cb) {
    cb(null, { fieldName: file.fieldname });
  },
  key: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

// ************** API routes *******************
app.get('/api/', (req, res) => {
  res.send('Hello World!');
});

app.post('/api/resize', (req, res) => {
  console.log('>>> req.files: ', req.files);

  let upload = multer({
    storage: s3Storage,
    fileFilter: helpers.imageFilter,
  }).array('image', 10);

  try {
    upload(req, res, function (err) {
      if (err) {
        throw err;
      }

      if (req.fileValidationError) {
        return res.send(req.fileValidationError);
      }
      let result = 'You have uploaded these images: <hr />';
      const files = req.files;

      // decode jwt
      const token = files[0].originalname.split('_')[0];
      const decoded = jwt.decode(token, 'sajib');
      console.log('>>> decoded: ', decoded); // { total: 3 }

      let index, len;

      // Loop through all the uploaded images and display them on frontend
      for (index = 0, len = files.length; index < len; ++index) {
        result += `<img src="${files[index].path}" width="300" style="margin-right: 20px;">`;
      }
      result += '<hr/><a href="./">Upload more images</a>';

      // send image token in SQS
      sendMessage(token);

      res.send(result);
    });
  } catch (error) {
    res.send('>>> error /resize: ', error);
  }
  // res.send('Successfully added message in SQS');
});

// *********************************************

const accountId = '799513362811';
const queueName = 'im-homework';

// Setup the sendMessage()
const sendMessage = (token) => {
  const params = {
    MessageBody: JSON.stringify({
      image_token: token,
      // public: true,
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
