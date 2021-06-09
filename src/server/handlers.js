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
  let images = [];
  const urlPromises = [];

  for (let i = 0; i < total; i++) {
    const key = `${genKey}${i}_resized.${extensions[i]}`;
    const url = getS3Image(key);
    urlPromises.push(url);

    // **** try with sending signedUrl to Client, but getting cors error for cross origin

    // try {
    //   const params = {
    //     Bucket: bucket,
    //     Key: key,
    //   };
    //   // const head = await s3.headObject(params).promise();
    //   // const url = s3.getSignedUrl('getObject', params);

    //   const url = getS3Image(key);
    //   urlPromises.push(url);

    //   // images.push(url);
    // } catch (error) {
    //   images.push(null);
    //   console.log('>>> error getImagesHandler: ', error);
    // }
  }

  try {
    images = await Promise.all(urlPromises);
  } catch (error) {
    console.log('>>> error getImagesHandler: ', error);
  }

  console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
  console.log('images: ', images);
  console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');

  return images;
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
          // console.log('=== key: ', key, ' === error: ', err);
          resolve(null);
        } else {
          const file = new Buffer.from(data.Body, 'binary');
          const attachment = file.toString('base64');

          resolve(attachment);
        }
      }
    );
  });
};

module.exports = {
  getImagesHandler,
};
