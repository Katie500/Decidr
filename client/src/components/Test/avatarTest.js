import React, { useState, useEffect } from 'react';
import { Box, Card, IconButton, Typography } from '@mui/material';
import axios from 'axios';

const AvatarCard = ({ avatar, index, selected, onClick }) => (
    <div
        style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            margin: '1rem',
            cursor: 'pointer',
        }}
        onClick={() => onClick(index)}
    >
        <img
            src={`data:image/svg+xml;base64,${avatar}`}
            alt={`Avatar ${index}`}
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

const AvatarTest = () => {
    const api = `https://api.multiavatar.com/45678945`;
    const [avatars, setAvatars] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAvatar, setSelectedAvatar] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = [];
                await Promise.all(Array.from({ length: 4 }, async (_, index) => {
                    const response = await axios.get(`${api}/${index}`, { responseType: 'arraybuffer' });
                    const base64 = arrayBufferToBase64(response.data);
                    data.push(base64);
                }));

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

    const setProfilePicture = () => {
        // Implement the logic to set the selected avatar as the profile picture
        console.log('Selected Avatar:', selectedAvatar);
    };

    return (
        <Box className="avatarContainer">
            {isLoading ? (
                <div className="loader-container">
                    {/* Placeholder for loading animation or image */}
                    Loading...
                </div>
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
                        {avatars.map((avatar, index) => (
                            <AvatarCard
                                key={index}
                                avatar={avatar}
                                index={index}
                                selected={selectedAvatar === index}
                                onClick={setSelectedAvatar}
                            />
                        ))}
                    </Card>

                    <IconButton
                        className="submit-btn"
                        onClick={setProfilePicture}
                        disabled={selectedAvatar === null}
                    >
                        Set as Profile Picture
                    </IconButton>
                </>
            )}
        </Box>
    );
};

export default AvatarTest;
