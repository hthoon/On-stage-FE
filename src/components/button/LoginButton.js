import React from 'react';
import PropTypes from "prop-types";
//import './LoginButton.css';

const LoginButton = ({ src, authLink, alt}) => {

    return (
        <a href={authLink}>
            <img src={src} alt={alt} className="login-button"/>
        </a>
    );
};

LoginButton.propTypes = {
    authLink: PropTypes.string.isRequired,
    src: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
};

export default LoginButton;