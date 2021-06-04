const express = require('express');
const app = express();
var multer = require('multer');
const helpers = require('./helpers');

var upload = multer();
const port = 3001;

// load config
require('dotenv').config();

// allow cors for all routes
const cors = require('cors');
app.use(cors());

// configure AWS
const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });

// Create SQS service client
const sqs = new AWS.SQS({
  apiVersion: '2012-11-05',
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },

  // By default, multer removes file extensions so let's add them back
  filename: function (req, file, cb) {
    const { fieldname, originalname } = file;
    cb(null, `${fieldname}-${Date.now()}-${file.originalname}`);
  },
});

// ************** API routes *******************
app.get('/api/', (req, res) => {
  res.send('Hello World!');
});

app.post('/api/resize', (req, res) => {
  let upload = multer({
    storage: storage,
    fileFilter: helpers.imageFilter,
  }).array('image', 10);

  try {
    upload(req, res, function (err) {
      if (err) {
        res.send(err);
      }
      console.log('>>> err: ', err);
      if (req.fileValidationError) {
        return res.send(req.fileValidationError);
      }
      let result = 'You have uploaded these images: <hr />';
      const files = req.files;
      let index, len;

      // Loop through all the uploaded images and display them on frontend
      for (index = 0, len = files.length; index < len; ++index) {
        result += `<img src="${files[index].path}" width="300" style="margin-right: 20px;">`;
      }
      result += '<hr/><a href="./">Upload more images</a>';
      res.send(result);
    });
  } catch (error) {
    res.send('>>> error /resize: ', error);
  }

  // sendMessage();
  // res.send('Successfully added message in SQS');
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
