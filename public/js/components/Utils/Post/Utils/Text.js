import React from 'react';
import { Link } from 'react-router';

// Helper: emotify, trim-suffix-link, linkify

export default ({ text, provider }) => {
    return (
        <p className="timeline__text">
            {text}
        </p>
    );
}