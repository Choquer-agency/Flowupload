const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

module.exports = async (req, res) => {
  // CORS headers - THESE MUST BE HERE
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { fileName, fileType, clientId } = req.body;
  
  if (!fileName || !clientId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const date = new Date();
  const dateFolder = `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
  const timestamp = Date.now();
  const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const key = `${clientId}/${dateFolder}/${timestamp}-${cleanFileName}`;

  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    Expires: 60,
    ContentType: fileType || 'application/octet-stream'
  };

  try {
    const uploadURL = await s3.getSignedUrlPromise('putObject', params);
    const downloadURL = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    
    res.status(200).json({ uploadURL, downloadURL, key });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to generate upload URL' });
  }
};
