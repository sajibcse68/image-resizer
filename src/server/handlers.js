const jwt = require('jwt-simple');
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

const s3 = new AWS.S3();
const bucket = 'im-homework';

const getImagesHandler = async (token) => {
  const payload = jwt.decode(token, 'sajib', true);
  const { key, size, extensions, total } = payload;
  const genKey = `${token}_`;
  const imageUrls = [];

  for (let i = 0; i < total; i++) {
    const key = `${genKey}${i}_resized.${extensions[i]}`;

    try {
      const params = {
        Bucket: bucket,
        Key: key,
      };
      const head = await s3.headObject(params).promise();
      const url = s3.getSignedUrl('getObject', params);

      imageUrls.push(url);
    } catch (error) {
      imageUrls.push(null);
      console.log('>>> error getImagesHandler: ', error);
    }
  }
  s3.ge;

  console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
  console.log('imageUrls: ', imageUrls);
  console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
  return imageUrls;
};

const getS3Image = (key) => {
  return new Promise((resolve, reject) => {
    s3.getObject(
      {
        Bucket: bucket,
        Key: key,
      },
      (err, data) => {
        if (err) {
          console.log('=== key: ', key, ' === error: ', err);
          resolve({ found: false });
        } else {
          // resolve({ found: true });
          // const file = new Buffer.from(data.Body, 'binary');
          // const attachment = file.toString('base64');

          resolve(data.Body);
        }
      }
    );
  });
};

module.exports = {
  getImagesHandler,
};
