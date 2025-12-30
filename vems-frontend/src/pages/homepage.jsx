import React from 'react';
import { useNavigate } from 'react-router-dom';

function Homepage() {
    const navigate = useNavigate();

    const backgroundStyle = {
        width: '100%',
        background: 'linear-gradient(135deg, #2419F0, #6F58FF)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: '20px',
    };

    const containerStyle = {
        maxWidth: '1000px',
        width: '100%',
        margin: '20px auto',
        padding: '40px',
        background: 'white',
        borderRadius: '15px',
        fontFamily: 'Arial, sans-serif',
        boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
    };

    const headerStyle = {
        textAlign: 'center',
        color: '#2b6cb0',
        fontSize: '32px',
        fontWeight: 'bold',
        marginBottom: '10px',
    };

    const subHeaderStyle = {
        textAlign: 'center',
        color: '#4a5568',
        fontSize: '16px',
        marginBottom: '40px',
    };

    const buttonGridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '20px',
        marginBottom: '30px',
    };

    const buttonStyle = {
        padding: '25px 15px',
        backgroundColor: '#2b6cb0',
        color: 'white',
        border: 'none',
        borderRadius: '10px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '18px',
        textAlign: 'center',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '120px',
    };

    const buttonIconStyle = {
        fontSize: '32px',
        marginBottom: '10px',
    };

    const handleMouseEnter = (e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08)';
        e.currentTarget.style.backgroundColor = '#2c5282';
    };

    const handleMouseLeave = (e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)';
        e.currentTarget.style.backgroundColor = '#2b6cb0';
    };

    const navigationButtons = [
        { 
            id: 1, 
            name: 'Dashboard', 
            icon: '📊',
            path: '/dashboard',
            description: 'View venue availability and statistics'
        },
        { 
            id: 2, 
            name: 'Booking', 
            icon: '📅',
            path: '/booking',
            description: 'Book venues and facilities'
        },
        { 
            id: 3, 
            name: 'User Profile', 
            icon: '👤',
            path: '/profile',
            description: 'Manage your account and settings'
        },
        { 
            id: 4, 
            name: 'Calendar', 
            icon: '📆',
            path: '/calendar',
            description: 'View and manage your schedule'
        },
        { 
            id: 5, 
            name: 'Help Centre', 
            icon: '❓',
            path: '/help',
            description: 'Get support and find answers'
        },
        { 
            id: 6, 
            name: 'My Booking', 
            icon: '📋',
            path: '/mybooking',
            description: 'Track and manage your bookings'
        },
    ];

    return (
        <div style={backgroundStyle}>
            <div style={containerStyle}>
                <h1 style={headerStyle}>Homepage</h1>
                <p style={subHeaderStyle}>
                    Welcome! Streamline your venue bookings and event scheduling.
                </p>
                
                <div style={buttonGridStyle}>
                    {navigationButtons.map((button) => (
                        <button
                            key={button.id}
                            style={buttonStyle}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            onClick={() => navigate(button.path)}
                        >
                            <div style={buttonIconStyle}>{button.icon}</div>
                            <div style={{ fontWeight: 'bold', fontSize: '20px', marginBottom: '5px' }}>
                                {button.name}
                            </div>
                            <div style={{ fontSize: '12px', opacity: 0.9 }}>
                                {button.description}
                            </div>
                        </button>
                    ))}
                </div>
                
                <div style={{
                    marginTop: '30px',
                    padding: '20px',
                    backgroundColor: '#f7fafc',
                    borderRadius: '8px',
                    borderLeft: '4px solid #38a169'
                }}>
                    <h3 style={{ color: '#2d3748', marginBottom: '10px' }}>📢 Quick Announcement</h3>
                    <p style={{ color: '#4a5568', margin: 0 }}>
                        System maintenance scheduled for this Saturday (10:00 PM - 02:00 AM). 
                    </p>
                </div>
                
                <div style={{
                    marginTop: '20px',
                    textAlign: 'center',
                    color: '#718096',
                    fontSize: '14px',
                    padding: '15px',
                    borderTop: '1px solid #e2e8f0'
                }}>
                    <p>Need assistance? Contact campus IT support at <strong>it-support@campus.edu</strong> or call <strong>+60 3-1234 5678</strong></p>
                </div>
            </div>
        </div>
    );
}

export default Homepage;