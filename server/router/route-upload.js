// global imports
const express = require('express');
const router = express.Router();
const aws = require('aws-sdk');

// middleware
const { authenticate } = require('./../middleware/authenticate');
// constants
const S3_BUCKET = process.env.S3_BUCKET_NAME;

// configure aws
aws.config.region = 'us-west-1';

// image uploading 
router.get('/api/image/sign-s3', authenticate, (req, res) => {
  const s3 = new aws.S3();
  
  const fileName = Date.now() + req.query['file-name'];
  const fileType = req.query['file-type'];
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read'
  };

  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if(err){
      console.log(err);
      return res.end();
    }
    const returnData = {
      signedRequest: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
    };
    
    res.write(JSON.stringify(returnData));
    res.end();
  });
});

module.exports = router;