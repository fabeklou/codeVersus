import path from 'path';
import { Storage } from '@google-cloud/storage';

const projectId = process.env.GCP_PROJECT_ID;
const bucketName = process.env.GCP_BUCKET_NAME;
const keyfile = path.join(__dirname, '../../config/gcloud-storage-key.json');

const storage = new Storage({
  projectId,
  keyFilename: path.join(__dirname, keyfile),
});

const sendToGCS = async (file, username) => {
  const bucket = storage.bucket(bucketName);
  const { originalname, buffer, mimetype } = file;
  const blob = bucket.file(`profile-${username.replace(/ /g, '_')}`);
  const blobStream = blob.createWriteStream({
    metadata: {
      contentType: mimetype,
    },
  });

  blobStream.on('error', (err) => {
    throw new Error(err);
  });

  blobStream.on('finish', async () => {
    await blob.makePublic();
    return `https://storage.googleapis.com/${bucketName}/${blob.name}`;
  });

  blobStream.end(buffer);
}

const deleteFromGCS = async (url) => {
  const filename = url.split('/').pop();
  const bucket = storage.bucket(bucketName);
  const file = bucket.file(filename);

  file.delete((err) => {
    if (err) {
      throw new Error(err);
    }
  });
}

export { sendToGCS, deleteFromGCS };
