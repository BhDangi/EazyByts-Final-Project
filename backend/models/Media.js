const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  title: String,
  description: String,
  thumbnailUrl: String,
  videoUrl: String
});

const Media = mongoose.model('Media', mediaSchema);

module.exports = Media;
