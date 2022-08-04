import * as multerS3 from "multer-s3";
import * as AWS from "aws-sdk";
import * as dotenv from "dotenv";
dotenv.config();

const bucketName = process.env.AWS_S3_BUCKET_NAME;

const s3 = new AWS.S3();
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_GEGION,
    correctClockSkew: true,
});

export const storage = multerS3({
    s3: s3,
    bucket: bucketName,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: "public-read",
    key: function (req, file, cb) {
        const fileName = `${Date.now().toString()}-${file.originalname}`;
        cb(null, fileName);
    },
});
