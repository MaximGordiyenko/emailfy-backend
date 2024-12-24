import jwt from 'jsonwebtoken';
import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { s3Client } from '../config/s3.js';
import { Image } from '../models/image.model.js';
import { Account } from '../models/account.model.js';
import axios from 'axios';

export const getCountries = async (req, res) => {
  try {
    const { data } = await axios.get(`https://restcountries.com/v2/all`);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateAccountInformation = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    const decoded = jwt.decode(token);
    
    const { email, currentPassword, newPassword, repeatNewPassword } = req.body;
    console.log( email, currentPassword, newPassword, repeatNewPassword);
    
    const isExistUser = await Account.findByPk(decoded.id);
    console.log(isExistUser);
    
    res.status(200).json('ok');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const uploadFile = async (req, res) => {
  try {
    const { headers: { authorization }, file: { originalname, buffer, mimetype } } = req;
    
    const token = authorization && authorization.split(' ')[1];
    const decoded = jwt.decode(token);
    console.log(decoded.id);
    
    if (!req?.file) return res.status(400).send('No file uploaded.');
    
    const fileName = `settings/userId-${decoded.id}_${Date.now()}_${originalname}`;
    
    // Prepare S3 upload parameters
    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: mimetype
    };
    
    // Upload to S3
    const command = new PutObjectCommand(uploadParams);
    await s3Client.send(command);
    
    // Construct the public URL of the uploaded image
    const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    
    // Store image metadata in the database
    await Image.create({
      fileName,
      originalName: originalname,
      mimeType: mimetype,
      accountId: decoded.id
    });
    
    res.status(200).json({
      message: 'File uploaded successfully',
      imageUrl: imageUrl
    });
  } catch (err) {
    console.error('Error uploading file:', err);
    res.status(500).json({ error: 'Error uploading file' });
  }
};

export const getProfileImage = async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  const decoded = jwt.decode(token);
  
  const bucketName = process.env.AWS_BUCKET_NAME;
  
  try {
    // Find image metadata in the database
    const image = await Image.findOne({
      where: {
        accountId: decoded.id
      }
    });
    
    if (!image) return res.status(404).send('Image not found.');
    
    // Generate a signed URL to access the image
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: image?.fileName
    });
    const AWSImageUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // URL expires in 1 hour
    
    res.status(200).json({
      message: 'Image is here',
      AWSImageUrl
    });
  } catch (err) {
    console.error('Error retrieving image:', err);
    res.status(500).json({ error: 'Error retrieving image' });
  }
};
