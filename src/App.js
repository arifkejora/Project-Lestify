import React from 'react';
import Player from './components/Player';
import UploadForm from './components/UploadForm'; // Mengimpor komponen UploadForm
import './styles.css';

function App() {
  return (
    <div className="App">
      <h1>Lestify</h1>
      <div className="container">
        <div className="player">
          <Player />
        </div>
        <div className="upload-form"> {/* Tambahkan div untuk formulir unggah */}
          <UploadForm /> {/* Memanggil komponen UploadForm di sini */}
        </div>
      </div>
    </div>
  );
}

export default App;
