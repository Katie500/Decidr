// SelectAvatarMenu.jsx
import React, { useState, useEffect } from 'react';
import { Box, Card, IconButton, Typography } from '@mui/material';
import axios from 'axios';

const AvatarCard = ({ avatar, id, selected, onClick }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      margin: '1rem',
      cursor: 'pointer',
    }}
    onClick={() => onClick(id)} // Pass the ID to the onClick handler
  >
    <img
      src={`data:image/svg+xml;base64,${avatar}`}
      alt={`Avatar ${id}`}
      style={{ width: '80px', height: '80px', borderRadius: '50%' }}
    />
    {selected && (
      <div
        style={{
          width: '20px',
          height: '20px',
          backgroundColor: '#2196F3',
          borderRadius: '50%',
          marginTop: '5px',
        }}
      />
    )}
  </div>
);

const SelectAvatarMenu = ({ onSelectAvatar }) => {
  const api = 'https://api.multiavatar.com/45678945';
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = [];
        await Promise.all(
          Array.from({ length: 4 }, async (_, index) => {
            const randomIndex = Math.round(Math.random() * 1000);
            const response = await axios.get(`${api}/${randomIndex}`, {
              responseType: 'arraybuffer',
            });
            const base64 = arrayBufferToBase64(response.data);
            data.push({ avatar: base64, id: randomIndex });
          })
        );

        setAvatars(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching avatars:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [api]);

  const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const handleAvatarClick = (selectedAvatarId) => {
    setSelectedAvatar(selectedAvatarId);
    const selectedAvatarURL = `${api}/${selectedAvatarId}`;
    onSelectAvatar(selectedAvatarURL);
    console.log('Selected Avatar URL:', selectedAvatarURL);
  };

  return (
    <Box className="avatarContainer">
      {isLoading ? (
        <div className="loader-container">Loading...</div>
      ) : (
        <>
          <Card
            style={{
              padding: '1rem',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
            }}
          >
            {avatars.map(({ avatar, id }) => (
              <AvatarCard
                key={id}
                avatar={avatar}
                id={id}
                selected={selectedAvatar === id}
                onClick={handleAvatarClick} // Pass the onClick handler
              />
            ))}
          </Card>
        </>
      )}
    </Box>
  );
};

export default SelectAvatarMenu;
