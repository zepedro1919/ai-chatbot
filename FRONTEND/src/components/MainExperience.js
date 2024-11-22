import React from 'react';
import logo from './naut_logo.png';
import './MainExperience.css';
import { useNavigate } from 'react-router-dom';


const MainExperience = () => {
    const navigate = useNavigate();

    // Display the logo and question, then show options after a short delay for cinematic effect
    React.useEffect(() => {
        const timer = setTimeout(() => 2000); // 2 seconds delay
        return () => clearTimeout(timer);
    }, []);

    const handleSelection = (type) => {
        navigate('/generate-render', { state: { type: type } });
    }

    return (
        <div className="main-container">
            {/* Spotlight effect */}
            <div className="spotlight"></div>

            {/* Nautilus Logo */}
            <img src={logo} alt="Nautilus Logo" className="logo" />

            {/* Question Text */}
            <div className="question-text">Are you looking for Education or Corporate?</div>

            {/* Buttons */}
            <div className='button-container'>
                <button className="button" onClick={() => handleSelection("education")}>Education</button>
                <button className="button" onClick={() => handleSelection("corporate")}>Corporate</button>
            </div>
        </div>
    );
};

export default MainExperience;

