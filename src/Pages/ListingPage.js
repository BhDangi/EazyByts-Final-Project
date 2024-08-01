import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './pages.css'; // Import the CSS file

const ListingPage = () => {
  const [mediaList, setMediaList] = useState([]);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const response = await axios.get('http://localhost:5000/media');
        setMediaList(response.data);
      } catch (error) {
        console.error('Error fetching media:', error);
      }
    };
    fetchMedia();
  }, []);

  const handleDelete = async (id, thumbnailUrl, videoUrl) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`http://localhost:5000/media/${id}`, {
          data: { thumbnailUrl, videoUrl }
        });
        setMediaList(mediaList.filter(media => media._id !== id));
      } catch (error) {
        console.error('Error deleting media:', error);
      }
    }
  };

  return (
    <div className="listing-background">
      <div className="listing-container">
        <h1>Media Listing</h1>
        <div className="media-grid">
          {mediaList.map((media) => (
            <div key={media._id} className="media-item">
              <Link to={`/media/${media._id}`} className="media-link">
                <img src={media.thumbnailUrl} alt={media.title} className="media-thumbnail" />
                <p className="media-title">{media.title}</p>
              </Link>
              <button
                onClick={() => handleDelete(media._id, media.thumbnailUrl, media.videoUrl)}
                className="delete-button"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListingPage;
