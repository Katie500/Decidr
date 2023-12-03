import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Page1 = () => {
  const multiavatarApi = `https://api.multiavatar.com`;
  const localApi = `http://localhost:3001/users`; // Replace with your actual API endpoint
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const localDataResponse = await axios.get(localApi);
        const users = localDataResponse.data;

        const avatarPromises = users.map(async (user) => {
          const avatarUrl = user.profilePicture; // Adjust the field name based on your data structure
          const response = await axios.get(`${multiavatarApi}/${avatarUrl}`, { responseType: 'arraybuffer' });
          const base64 = arrayBufferToBase64(response.data);
          return base64;
        });

        const data = await Promise.all(avatarPromises);

        setAvatars(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching avatars:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [localApi]);

  const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  return (
    <div className="avatarContainer">
      {isLoading ? (
        <div className="loader-container">
          {/* Placeholder for loading animation or image */}
          Loading...
        </div>
      ) : (
        <>
          <div className="avatars">
            {avatars.map((avatar, index) => (
              <div key={index}>
                <img
                  src={`data:image/svg+xml;base64,${avatar}`}
                  alt="avatar"
                  style={{ width: '50px', height: '50px' }}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Page1;
