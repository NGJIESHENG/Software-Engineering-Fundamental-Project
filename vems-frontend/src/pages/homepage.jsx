import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

function Homepage() {
    const navigate = useNavigate();
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (!user) {
           
            navigate('/');
        } else if (user.Role === 'Admin') {
            
            navigate('/admin-dashboard');
        }
    }, [navigate]);
        
    
    

    const styles = {
        background: {
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #237be0, #003590)',
            padding: '20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },

        container: {
            maxWidth: '1000px',
            width: '100%',
            background: 'white',
            borderRadius: '15px',
            padding: '40px',
            fontFamily: 'Arial, sans-serif',
            boxShadow: '0 8px 30px rgba(0,0,0,0.15)'
        },

        header: {
            textAlign: 'center',
            color: '#2b6cb0',
            fontSize: '32px',
            fontWeight: 'bold',
            marginBottom: '10px'
        },

        subHeader: {
            textAlign: 'center',
            color: '#4a5568',
            fontSize: '16px',
            marginBottom: '40px'
        },

        buttonGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
            marginBottom: '30px'
        },

        button: {
            padding: '25px 15px',
            backgroundColor: '#2b6cb0',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '18px',
            textAlign: 'center',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '120px'
        },

        loggoutButton: {
            position: 'absolute',
            top: '20px',
            right: '20px',
            padding: '10px 15px',
            backgroundColor: '#48bb78',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold'
        },

        buttonIcon: {
            fontSize: '32px',
            marginBottom: '10px'
        },

        buttonHover: {
            transform: 'translateY(-2px)',
            boxShadow: '0 7px 14px rgba(50, 50, 93, 0.1)',
            background: '#2c5282'
        },

        announcement: {
            marginTop: '30px',
            padding: '20px',
            background: '#f7fafc',
            borderRadius: '8px',
            borderLeft: '4px solid #38a169'
        },

        footer: {
            marginTop: '20px',
            textAlign: 'center',
            color: '#718096',
            fontSize: '14px',
            padding: '15px',
            borderTop: '1px solid #e2e8f0'
        }

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
            path: '/user-profile',
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
            path: '/my-booking',
            description: 'Track and manage your bookings'
        },
    ];

    const handleButtonHover = (e, isEnter) => {
        Object.assign(e.currentTarget.style, 
            isEnter ? styles.buttonHover : styles.button
        );
    };

    return (
        <div style={styles.background}>
            <div style={styles.container}>
                <h1 style={styles.header}>Homepage</h1>
                <p style={styles.subHeader}>
                    Welcome! Streamline your venue bookings and event scheduling.
                </p>

                <button 
                    style={styles.loggoutButton}
                    onClick={() => {localStorage.removeItem('token'); navigate('/');}}
                >
                    Log out
                </button>
                
                <div style={styles.buttonGrid}>
                    {navigationButtons.map((button) => (
                        <button
                            key={button.id}
                            style={styles.button}
                            onMouseEnter={(e) => handleButtonHover(e, true)}
                            onMouseLeave={(e) => handleButtonHover(e, false)}
                            onClick={() => navigate(button.path)}
                        >
                            <div style={styles.buttonIcon}>{button.icon}</div>
                            <div style={{ fontWeight: 'bold', fontSize: '20px', marginBottom: '5px' }}>
                                {button.name}
                            </div>
                            <div style={{ fontSize: '12px', opacity: 0.9 }}>
                                {button.description}
                            </div>
                        </button>
                    ))}
                </div>
                
                <div style={styles.announcement}>
                    <h3 style={{ color: '#2d3748', marginBottom: '10px' }}>📢 Quick Announcement</h3>
                    <p style={{ color: '#4a5568', margin: 0 }}>
                        System maintenance scheduled for this Saturday (10:00 PM - 02:00 AM). 
                    </p>
                </div>
                
                <div style={styles.footer}>
                    <p>Need assistance? Contact campus IT support at <strong>it-support@campus.edu</strong> or call <strong>+60 3-1234 5678</strong></p>
                </div>
            </div>
        </div>
    );
}

export default Homepage;