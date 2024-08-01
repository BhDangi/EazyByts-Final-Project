import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UploadPage from './Pages/UploadPage';
import ListingPage from './Pages/ListingPage';
import VideoPage from './Pages/VideoPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UploadPage />} />
        <Route path="/listing" element={<ListingPage />} />
        <Route path="/media/:id" element={<VideoPage />} />
      </Routes>
    </Router>
  );
};

export default App;

