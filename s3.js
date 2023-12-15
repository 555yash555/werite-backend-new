import dotenv from "dotenv";
import aws from "aws-sdk";

// import crypto from 'crypto'
// import { promisify } from "util"
// const randomBytes = promisify(crypto.randomBytes)

dotenv.config();

const region = "ap-south-1";
const bucketName = "werite-video-recordings";
const accessKeyId = process.env.accessKeyId;
const secretAccessKey = process.env.secretAccessKey;

const s3 = new aws.S3({
  region,
  accessKeyId,
  secretAccessKey,

  signatureVersion: "v4",
});

export async function generateUploadURL(recordingname) {
  //   const rawBytes = await randomBytes(16)
  // const imageName = "video.webm"

  const params = {
    Bucket: bucketName,
    Key: recordingname,
    Expires: 60,
  };

  const uploadURL = await s3.getSignedUrlPromise("putObject", params);
  // console.log(`uploadURL: ${uploadURL}`)
  return uploadURL;
}

export async function generateUploadImageURL(recordingname, file) {
  const fileBuffer = file.buffer;
  const params = {
    Bucket: bucketName,
    Key: recordingname,
    Body: fileBuffer,
    ContentType: file.mimetype,
  };
  return new Promise((resolve, reject) => {
    s3.putObject(params, function (err, data) {
      if (err) {
        console.log(`Failed to upload file to S3: ${err}`);
        reject(err);
      } else {
        console.log(
          `File uploaded successfully to ${bucketName}/${recordingname}`
        );
        const url = `https://s3.${region}.amazonaws.com/${bucketName}/${recordingname}`;
        // https://s3.ap-south-1.amazonaws.com/werite-video-recordings/${recordingname}
        resolve(url);
      }
    });
  });
}

export async function upload(filename, file) {
  const fileBuffer = file.buffer;
  const params = {
    Bucket: bucketName,
    Key: filename,
    Body: fileBuffer,
    ContentType: file.mimetype,
  };
  let prom = new Promise((resolve, reject) => {
    s3.putObject(params, function (err, data) {
      if (err) {
        console.log(`Failed to upload file to S3: ${err}`);
        reject(err);
      } else {
        console.log(`File uploaded successfully to ${bucketName}/${filename}`);
        const url = `https://s3.${region}.amazonaws.com/${bucketName}/${filename}`;
        // https://s3.ap-south-1.amazonaws.com/werite-video-recordings/${recordingname}
        resolve(url);
      }
    });
  });

  return prom;
}
