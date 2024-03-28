import React, { useState } from 'react';
import { storage } from '../firebase/firebase';

const UploadForm = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [artistName, setArtistName] = useState('');

  const handleFileUpload = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileNameChange = (event) => {
    setFileName(event.target.value);
  };

  const handleArtistNameChange = (event) => {
    setArtistName(event.target.value);
  };

  const uploadSong = async () => {
    if (selectedFile && fileName && artistName) {
      const metadata = {
        customMetadata: {
          title: fileName,
          artist: artistName
        }
      };

      const uploadTask = storage.ref(`music/${fileName}`).put(selectedFile, metadata);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Progress tracking
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          console.log(`Upload progress: ${progress}%`);
        },
        (error) => {
          // Error handling
          console.error('Upload error:', error);
        },
        () => {
          // Upload success
          console.log('Upload successful');
          // You can add additional logic here, such as updating UI or database
        }
      );
    } else {
      console.error('Please select a file, provide a file name, and enter artist name');
    }
  };

  return (
    <div>
      <input type="file" accept="audio/*" onChange={handleFileUpload} />
      <input
        type="text"
        placeholder="Enter file name"
        value={fileName}
        onChange={handleFileNameChange}
      />
      <input
        type="text"
        placeholder="Enter artist name"
        value={artistName}
        onChange={handleArtistNameChange}
      />
      <button onClick={uploadSong}>Upload</button> {/* Penanganan peristiwa klik untuk unggah */}
    </div>
  );
};

export default UploadForm;
