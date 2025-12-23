import React, { useState } from 'react';

function Dashboard() {
    const [venue] = useState([
        { id: 1, name: 'DTC Grand Hall', capacity: 5000, status: 'Available' },
        { id: 2, name: 'Multi-purpose Hall', capacity: 200, status: 'Booked' },
        { id: 3, name: 'Lecture Hall CNMX1001', capacity: 120, status: 'Available' },
        { id: 4, name: 'Swimming Pool', capacity: 50, status: 'Maintenance' },
    ]);

    const tableStyle = {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '20px',
        fontFamily: 'Arial, sans-serif'
    };

    const thStyle = {
        backgroundColor: '#2b6cb0',
        color: 'white',
        padding: '12px',
        textAlign: 'left',
        border: '1px solid #ddd'
    };

    const tdStyle = {
        padding: '10px',
        border: '1px solid #ddd'
    };

    
    return (
        <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
            <h1 style={{ color: '#2b6cb0' }}>Venue Availability</h1>
            <p>Welcome! Check the status of campus venues below before submitting a booking request.</p>

            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={thStyle}>Venue Name</th>
                        <th style={thStyle}>Capacity</th>
                        <th style={thStyle}>Current Status</th>
                        <th style={thStyle}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {venue.map((v) => (
                        <tr key={v.id}>
                            <td style={tdStyle}>{v.name}</td>
                            <td style={tdStyle}>{v.capacity}</td>
                            <td style={{ 
                                ...tdStyle, 
                                fontWeight: 'bold', 
                                color: v.status === 'Available' ? 'green' : 'red' 
                            }}>
                                {v.status}
                            </td>
                            <td style={tdStyle}>
                                {v.status === 'Available' ? (
                                    <button style={{ 
                                        padding: '5px 10px', 
                                        backgroundColor: '#3182ce', 
                                        color: 'white', 
                                        border: 'none', 
                                        borderRadius: '4px', 
                                        cursor: 'pointer' 
                                    }}>
                                        Book Now
                                    </button>
                                ) : (
                                    <span style={{ color: '#888' }}>Unavailable</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Dashboard;