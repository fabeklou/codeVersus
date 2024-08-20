import { Storage } from '@google-cloud/storage';

const projectId = process.env.GCP_PROJECT_ID;
const bucketName = process.env.GCP_BUCKET_NAME;
const keyfile = process.env.GCP_KEYFILE_PATH;

const storage = new Storage({
  projectId,
  keyFilename: keyfile,
});

const sendToGCS = async (file, username) => {
  return new Promise((resolve, reject) => {
    const bucket = storage.bucket(bucketName);
    const { originalname, buffer, mimetype } = file;
    const blob = bucket.file(`profilePicture-${username.replace(/ /g, '_')}--${originalname}`);
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: mimetype,
      },
    });

    blobStream.on('error', (err) => {
      reject(new Error(err));
    });

    blobStream.on('finish', async () => {
      try {
        await blob.makePublic();
        const publicUrl = `https://storage.googleapis.com/${bucketName}/${blob.name}`;
        resolve(publicUrl);
      } catch (err) {
        reject(new Error(err));
      }
    });

    blobStream.end(buffer);
  });
}

const deleteFromGCS = async (url) => {
  const filename = url.split('/').pop();
  const bucket = storage.bucket(bucketName);
  const file = bucket.file(filename);

  try {
    await file.delete();
  } catch (err) {
    throw new Error(err);
  }
}

export { sendToGCS, deleteFromGCS };
