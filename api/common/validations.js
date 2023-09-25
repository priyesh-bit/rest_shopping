const dotenv = require("dotenv");
dotenv.config();

const AWSACCESSKEY = process.env.AWSACCESSKEY;
const AWSSECRETACCESSKEY = process.env.AWSSECRETACCESSKEY;

const AWS = require('aws-sdk');
AWS.config.update({
  accessKeyId: AWSACCESSKEY,
  secretAccessKey: AWSSECRETACCESSKEY,
  region: 'us-east-1',
});
const rekognition = new AWS.Rekognition();

function isEmail(email) {
  var emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  if (email !== "" && email.match(emailFormat)) {
    return true;
  }

  return false;
}

const detectExplicitContent = async (image) => {
  const params = {
    Image: {
      Bytes: image,
    }
  };
  const response = await rekognition.detectModerationLabels(params).promise();
  console.log(response);
  const moderationLabels = response.ModerationLabels;
  if (moderationLabels.length > 0) {
    return true;
  } else {
    return false;
  }
};

module.exports = { isEmail, detectExplicitContent };
