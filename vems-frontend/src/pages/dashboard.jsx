import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const navigate = useNavigate();
    const [venues, setVenues] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const styles = {
        container: {
            padding: '40px',
            maxWidth: '1000px',
            margin: '0 auto',
            fontFamily: 'Arial, sans-serif'
        },
        header: {
            color: '#2b6cb0',
            marginBottom: '10px'
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse',
            marginTop: '20px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        },
        th: {
            backgroundColor: '#2b6cb0',
            color: 'white',
            padding: '15px',
            textAlign: 'left',
            borderBottom: '2px solid #2c5282'
        },
        td: {
            padding: '15px',
            borderBottom: '1px solid #e2e8f0',
            color: '#4a5568'
        },
        row: {
            backgroundColor: 'white'
        },
        bookButton: {
            padding: '8px 16px',
            backgroundColor: '#3182ce',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'background 0.2s'
        },
        disabledText: {
            color: '#a0aec0',
            fontStyle: 'italic',
            fontSize: '14px'
        },
        backButton: { 
            display: 'block', 
            margin: '40px auto 0', 
            padding: '12px 30px', 
            background: '#718096', 
            color: 'white', 
            border: 'none', 
            borderRadius: '8px', 
            fontWeight: 'bold', 
            cursor: 'pointer', 
            transition: 'background 0.3s' },
    };

    useEffect(() => {
        fetchVenues();
    }, []);

    const fetchVenues = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/venues');
            setVenues(response.data);
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching venues:", error);
            setIsLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'Available': return '#38a169'; // Green
            case 'Maintenance': return '#dd6b20'; // Orange
            case 'Closed': return '#e53e3e'; // Red
            case 'Reserved': return '#805ad5'; // Purple
            default: return '#718096'; // Grey
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>Venue Availability Dashboard</h1>
            <p style={{ color: '#4a5568', fontSize: '16px' }}>
                Real-time status of all campus facilities. Check availability before booking.
            </p>

            {isLoading ? (
                <p style={{ marginTop: '20px' }}>Loading venue data...</p>
            ) : (
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Venue Name</th>
                            <th style={styles.th}>Type</th>
                            <th style={styles.th}>Capacity</th>
                            <th style={styles.th}>Current Status</th>
                            <th style={styles.th}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {venues.map((v) => (
                            <tr key={v.id} style={styles.row}>
                                <td style={styles.td}>
                                    <strong>{v.name}</strong>
                                </td>
                                <td style={styles.td}>{v.type}</td>
                                <td style={styles.td}>{v.capacity} pax</td>
                                <td style={{ 
                                    ...styles.td, 
                                    fontWeight: 'bold', 
                                    color: getStatusColor(v.status) 
                                }}>
                                    {v.status}
                                </td>
                                <td style={styles.td}>
                                    {v.status === 'Available' ? (
                                        <button 
                                            style={styles.bookButton}
                                            onClick={() => navigate('/booking')}
                                        >
                                            Book Now
                                        </button>
                                    ) : (
                                        <span style={styles.disabledText}>Unavailable</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <button 
                style={styles.backButton} 
                onClick={() => navigate('/homepage')}
            >
                Back to Home
            </button>
        </div>
    );
}

export default Dashboard;