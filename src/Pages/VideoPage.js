import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './pages.css'; // Import the CSS file

const VideoPage = () => {
  const { id } = useParams();
  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/media/${id}`);
        console.log('Fetched Media:', response.data); // Ensure this logs the correct data
        setVideoUrl(response.data.videoUrl);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching media:', error);
        setError('Failed to fetch media.');
        setLoading(false);
      }
    };
    fetchMedia();
  }, [id]);

  if (loading) return <p className="loading-message">Loading video...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="video-page">
      <h1 className="page-title">Video Page</h1>
      {videoUrl ? (
        <div className="video-container">
          <video className="video-player" controls autoPlay>
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      ) : (
        <p className="no-video-message">No video available.</p>
      )}
    </div>
  );
};

export default VideoPage;
