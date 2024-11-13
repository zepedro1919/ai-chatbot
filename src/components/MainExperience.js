import React, { useState } from 'react';
import logo from './naut_logo.png';
import './MainExperience.css';

const MainExperience = () => {
    const [showOptions, setShowOptions] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');

    // Display the logo and question, then show options after a short delay for cinematic effect
    React.useEffect(() => {
        const timer = setTimeout(() => setShowOptions(true), 2000); // 2 seconds delay
        return () => clearTimeout(timer);
    }, []);

    const handleSelection = (option) => {
        setSelectedOption(option);
        // Add further logic here to load the image or next screen based on selection
    };

    return (
        <div className="main-container">
            {/* Spotlight effect */}
            <div className="spotlight"></div>

            {/* Nautilus Logo */}
            <img src={logo} alt="Nautilus Logo" className="logo" />

            {/* Question Text */}
            <div className="question-text">Are you looking for education or corporate?</div>

            {/* Buttons */}
            <div className='button-container'>
                <button className="button" onClick={handleSelection}>Education</button>
                <button className="button" onClick={handleSelection}>Corporate</button>
            </div>
        </div>
    );
};

export default MainExperience;

