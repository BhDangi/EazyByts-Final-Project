const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cloudinary = require('./cloudinaryConfig');
const cors = require('cors');
const app = express();
const { Readable } = require('stream');
const Media = require('./models/Media'); // Adjust the path as necessary

const port = 5000;

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/media-app', { useNewUrlParser: true, useUnifiedTopology: true });

// Middleware
app.use(express.json());
app.use(cors());

// File upload configuration
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Helper function to upload file to Cloudinary
const uploadToCloudinary = (file, resourceType) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream({ resource_type: resourceType }, (error, result) => {
      if (error) {
        return reject(error);
      }
      resolve(result.secure_url);
    });

    // Convert buffer to stream
    const bufferStream = new Readable();
    bufferStream.push(file.buffer);
    bufferStream.push(null);
    bufferStream.pipe(uploadStream);
  });
};

app.post('/upload', upload.fields([{ name: 'thumbnail' }, { name: 'video' }]), async (req, res) => {
  try {
    console.log('Upload request received');

    const { title, description } = req.body;
    console.log('Title:', title);
    console.log('Description:', description);

    const thumbnailFile = req.files['thumbnail'] ? req.files['thumbnail'][0] : null;
    const videoFile = req.files['video'] ? req.files['video'][0] : null;

    let thumbnailUrl = null;
    let videoUrl = null;

    // Upload thumbnail if exists
    if (thumbnailFile) {
      console.log('Thumbnail file received');
      thumbnailUrl = await uploadToCloudinary(thumbnailFile, 'image');
      console.log('Thumbnail upload response:', thumbnailUrl);
    } else {
      console.log('No thumbnail file received');
    }

    // Upload video if exists
    if (videoFile) {
      console.log('Video file received');
      videoUrl = await uploadToCloudinary(videoFile, 'video');
      console.log('Video upload response:', videoUrl);
    } else {
      console.log('No video file received');
    }

    const newMedia = new Media({
      title,
      description,
      thumbnailUrl: thumbnailUrl,
      videoUrl: videoUrl
    });

    console.log('Saving new media:', newMedia);
    await newMedia.save();
    res.status(201).json(newMedia);
  } catch (error) {
    console.error('Error during upload:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/media', async (req, res) => {
  try {
    console.log('Fetching media list from database');
    const mediaList = await Media.find();
    console.log('Media list fetched:', mediaList);
    res.status(200).json(mediaList);
  } catch (error) {
    console.error('Error fetching media:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/media/:id', async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) {
      return res.status(404).json({ error: 'Media not found' });
    }
    res.status(200).json(media);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/media/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { thumbnailUrl, videoUrl } = req.body;

    // Delete media from Cloudinary
    if (thumbnailUrl) {
      const thumbnailPublicId = thumbnailUrl.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(thumbnailPublicId, { resource_type: 'image' });
    }
    if (videoUrl) {
      const videoPublicId = videoUrl.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(videoPublicId, { resource_type: 'video' });
    }

    // Delete media from MongoDB
    await Media.findByIdAndDelete(id);

    res.status(200).json({ message: 'Media deleted successfully' });
  } catch (error) {
    console.error('Error deleting media:', error);
    res.status(500).json({ error: error.message });
  }
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
