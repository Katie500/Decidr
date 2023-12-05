import React, { useState } from 'react';
import SelectAvatarMenu from './SelectAvatarMenu';
import Page1 from './page1';

const AvatarPage = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [selectedAvatar, setSelectedAvatar] = useState(null);
    const [selectedAvatarImage, setSelectedAvatarImage] = useState(null);

    const handleMenuToggle = () => {
        setIsMenuOpen((prevIsMenuOpen) => !prevIsMenuOpen);
    };

    const handleAvatarSelect = (avatarIndex, avatarImage) => {
        setSelectedAvatar(avatarIndex);
        setSelectedAvatarImage(avatarImage);
        setIsMenuOpen(false);
    };

    return (
        <div>
            <h2>Database Users:</h2>
            <Page1/>
            <button onClick={handleMenuToggle}>Open Select Avatar Menu</button>
            {isMenuOpen && (
                <SelectAvatarMenu onSelect={handleAvatarSelect} />
            )}
            {selectedAvatar !== null && selectedAvatarImage !== null && (
                <div>

                    <p>Selected Avatar Index: {selectedAvatar}</p>
                        {/* Display the selected avatar image */}
                                        <img
                        src={selectedAvatarImage}
                        alt="Selected Avatar"
                        style={{ width: '100px', height: '100px' }}
                    />

                </div>
            )}
        </div>
    );
};

export default AvatarPage;
