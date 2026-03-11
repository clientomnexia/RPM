import React from 'react';

const Loader = ({ message = "Preparing your royal experience..." }) => {
    return (
        <div className="loading-container">
            <div className="loading-spinner"></div>
            <p style={{ color: 'var(--secondary)', fontWeight: '500', letterSpacing: '1px' }}>
                {message}
            </p>
        </div>
    );
};

export default Loader;
