import React, { useState, useEffect, useRef } from 'react';
import { storage } from '../firebase/firebase';

const Player = () => {
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [audio, setAudio] = useState(new Audio());
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    // Mengambil daftar lagu dari Firebase Storage
    const fetchSongs = async () => {
      const songsRef = storage.ref('music');
      const songList = [];
      
      // Mendapatkan daftar item di dalam folder 'music'
      const items = await songsRef.listAll();
      
      // Mendapatkan URL unduhan untuk setiap lagu
      await Promise.all(items.items.map(async item => {
        const downloadURL = await item.getDownloadURL();
        const metadata = await item.getMetadata();
        const song = {
          title: metadata.customMetadata.title,
          artist: metadata.customMetadata.artist,
          path: item.fullPath, // Menambahkan fullPath sebagai path lagu
          url: downloadURL
        };
        songList.push(song);
      }));

      // Setelah semua lagu didapatkan, set state
      setSongs(songList);
    };

    fetchSongs();
  }, []);

  useEffect(() => {
    if (currentSong) {
      const songRef = storage.ref().child(currentSong.path);
      songRef.getDownloadURL().then(url => {
        setAudio(new Audio(url));
      }).catch(error => {
        console.error('Error getting download URL:', error);
      });
    }
  }, [currentSong]);

  useEffect(() => {
    audio.addEventListener('timeupdate', () => {
      const currentTime = audio.currentTime;
      const duration = audio.duration;
      setProgress((currentTime / duration) * 100);
      setCurrentTime(currentTime);
    });

    // Mendapatkan durasi lagu saat tersedia
    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
    });

    // Membersihkan event listener saat komponen dilepas
    return () => {
      audio.removeEventListener('timeupdate', () => {});
      audio.removeEventListener('loadedmetadata', () => {});
    };
  }, [audio]);

  const handleSelectSong = (song) => {
    if (song && song.path) {
      setCurrentSong(song);
    }
  };

  const playSong = () => {
    audio.play();
  };

  const pauseSong = () => {
    audio.pause();
  };

  const stopSong = () => {
    audio.pause();
    audio.currentTime = 0;
  };

  return (
    <div>
      <div className="song-list">
        <h2>Song List</h2>
        <ul>
          {songs.map((song, index) => (
            <li key={index} onClick={() => handleSelectSong(song)} className={currentSong === song ? 'selected' : ''}>
              <strong>{song.title}</strong> - {song.artist}
            </li>
          ))}
        </ul>
      </div>
      <div className="progress-bar">
        <progress value={progress} max="100" style={{ backgroundColor: '#ffc107', width: '100%', height: '10px', marginBottom: '5px' }} />
        <div className="time-info" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
      <div className="controls">
        <button onClick={playSong} disabled={!currentSong}>Play</button>
        <button onClick={pauseSong} disabled={!currentSong}>Pause</button>
        <button onClick={stopSong} disabled={!currentSong}>Stop</button>
      </div>
      {!currentSong && (
        <p>No song selected</p>
      )}
    </div>
  );
  
  
};

// Fungsi untuk mengonversi waktu dalam detik menjadi format menit:detik
const formatTime = (time) => {
  if (isNaN(time)) {
    return '00:00';
  }
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export default Player;
