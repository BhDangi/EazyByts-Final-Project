import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './pages.css'; // Import the CSS file

const UploadPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [video, setVideo] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('thumbnail', thumbnail);
    formData.append('video', video);

    try {
      await axios.post('http://localhost:5000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Upload successful!');
      navigate('/listing'); // Redirect after successful upload
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Error uploading files. Please try again.');
    }
  };

  const handleGoToListing = () => {
    navigate('/listing');
  };

  return (
    <div className="upload-background">
      <div className="upload-container">
        <h1>Upload Media</h1>
        <form onSubmit={handleSubmit} className="upload-form">
          <label>
            Title:
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength="50"
              required
            />
          </label>
          <label>
            Description:
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength="200"
              required
            ></textarea>
          </label>
          <label>
            Upload Thumbnail:
            <input
              type="file"
              accept="image/jpg, image/png"
              onChange={(e) => setThumbnail(e.target.files[0])}
              required
            />
          </label>
          <label>
            Upload Video:
            <input
              type="file"
              accept="video/mpg, video/avi, video/mp4"
              onChange={(e) => setVideo(e.target.files[0])}
              required
            />
          </label>
          <button type="submit" className="submit-button">Upload</button>
        </form>
        <button onClick={handleGoToListing} className="listing-button">Go to Listing</button>
      </div>
    </div>
  );
};

export default UploadPage;
