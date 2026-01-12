import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Booking() {
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedVenueType, setSelectedVenueType] = useState('');
    const [selectedVenue, setSelectedVenue] = useState('');

    const styles = {
        container: {
            maxWidth: '1000px',
            margin: '40px auto',
            padding: '30px',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            fontFamily: 'Arial, sans-serif'
        },

        header: {
            textAlign: 'center',
            marginBottom: '30px'
        },
        title: {
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#2b6cb0',
            marginBottom: '10px'
        },
        subtitle: {
            color: '#4a5568',
            fontSize: '16px'
        },
        step: {
            background: '#e0f0fb',
            padding: '25px',
            borderRadius: '10px',
            marginBottom: '25px'
        },
        stepTitle: {
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#2d3748',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
        },

        label: {
            display: 'block',
            fontSize: '14px',
            fontWeight: '600',
            color: '#4a5568',
            marginBottom: '8px'
        },
        dateInput: {
            width: '100%',
            maxWidth: '300px',
            padding: '12px',
            border: '1px solid #b5babe',
            borderRadius: '6px',
            fontSize: '16px',
            cursor: 'pointer',
            background: 'white'
        },
        grid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: '15px'
        },
        card: {
            background: 'white',
            border: '2px solid #e2e8f0',
            borderRadius: '10px',
            padding: '15px',
            cursor: 'pointer',
            textAlign: 'center',
            transition: 'all 0.3s ease',
            minHeight: '120px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
        },
        selectedCard: {
            border: '2px solid #38a169',
            background: '#f0fff4',
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(56, 161, 105, 0.15)'
        },
        icon: {
            fontSize: '32px',
            marginBottom: '10px'
        },
        name: {
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#2d3748',
            marginBottom: '8px'
        },

        badge: {
            fontSize: '11px',
            color: '#38a169',
            background: '#f0fff4',
            padding: '3px 8px',
            borderRadius: '12px'
        },

        continueButton: {
            width: '100%',
            padding: '15px',
            background: '#2b6cb0',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginTop: '20px',
            transition: 'background 0.3s'
        },

         disabledButton: {
            background: '#cbd5e0',
            cursor: 'not-allowed'
        },

        capacity: {
            fontSize: '14px',
            color: '#4a5568'
        }
    };

    const venueTypes = [
        {
            id: 'hall',
            name: 'Hall',
            icon: '🏛️',
            venues: [
                { id: 1, name: 'DTC Grand Hall', capacity: 5000 },
                { id: 2, name: 'Multi-purpose Hall', capacity: 200}
            ]
        },
        {
            id: 'lecture',
            name: 'Lecture Hall',
            icon: '📚',
            venues: [
                { id: 3, name: 'Lecture Hall CNMX1001', capacity: 120},
                { id: 4, name: 'Lecture Hall CNMX1002', capacity: 120},
                { id: 5, name: 'Lecture Hall CNMX1003', capacity: 120},
                { id: 6, name: 'Lecture Hall CNMX1004', capacity: 120},
                { id: 7, name: 'Lecture Hall CNMX1005', capacity: 120}
            ]
        },
        {
            id: 'sport',
            name: 'Sports Facility',
            icon: '⚽️',
            venues: [
                { id: 8, name: 'Swimming Pool', capacity: 50},
                { id: 9, name: 'Basketball Court', capacity: 100 }
            ]
        },
        {
            id: 'fci',
            name: 'FCI',
            icon: '💻',
            venues: [
                { id: 10,name:'CQAR 1001', capacity: 30},
                { id: 11,name:'CQAR 1002', capacity: 30},
                { id: 12,name:'CQAR 1003', capacity: 30},
                { id: 13,name:'CQAR 1004', capacity: 30},
                { id: 14,name:'CQAR 1005', capacity: 30},
                { id: 15,name:'CQCR 2001', capacity: 30},
                { id: 16,name:'CQCR 2002', capacity: 30},
                { id: 17,name:'CQCR 2003', capacity: 30},
                { id: 18,name:'CQCR 2004', capacity: 30},
                { id: 19,name:'CQCR 2005', capacity: 30}
            ]
        }
    ];

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    const handleContinue = () => {
         if (!selectedDate || !selectedVenueType || !selectedVenue) {
            alert('Please complete all selections');
            return;
        }

        const type = venueTypes.find(t => t.id === selectedVenueType);
        const venue = type.venues.find(v => v.name === selectedVenue);
        const dateObj = new Date(selectedDate);

        navigate('/bookingform', {
            state: {
                date: dateObj,
                venueType: selectedVenueType,
                venueTypeName: type.name,
                venue: selectedVenue,
                venueDetails: venue,
                formattedDate: selectedDate
            }
        });
    };

    const selectedVenues = selectedVenueType 
        ? venueTypes.find(t => t.id === selectedVenueType)?.venues || []
        : [];

    const isContinueDisabled = !selectedDate || !selectedVenueType || !selectedVenue;

    const formatDisplayDate = (dateString) => {
        if (!dateString) return 'Select a date';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };
    
    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>Campus Venue Booking System</h1>
                <p style={styles.subtitle}>Choose date, venue type, and venue</p>
            </div>

             <div style={styles.step}>
               <h2 style={styles.stepTitle}>Select Date</h2>
                 <div style={{ marginBottom: '25px' }}>
                    <label style={styles.label}>Booking Date *</label>
                    <input
                        type="date"
                        style={styles.dateInput}
                        value={selectedDate}
                        onChange={handleDateChange}
                        min={new Date().toISOString().split('T')[0]}
                    />

                    {selectedDate && (
                        <p style={{ fontSize: '14px', color: '#38a169', marginTop: '8px' }}>
                            📅 Selected: {formatDisplayDate(selectedDate)}
                        </p>
                    )}
                    <p style={{ fontSize: '12px', color: '#718096', marginTop: '8px' }}>
                        Click the calendar icon to pick a date
                    </p>
                </div>
            </div>

            <div style={styles.step}>
                <h2 style={styles.stepTitle}>Select Venue Type</h2>
                <div style={styles.grid}>
                    {venueTypes.map(type => (
                        <div
                            key={type.id}
                            style={{
                                ...styles.card,
                                ...(selectedVenueType === type.id ? styles.selectedCard : {})
                            }}
                            onClick={() => {
                                setSelectedVenueType(type.id);
                                setSelectedVenue('');
                            }}
                        >
                            <div style={styles.icon}>{type.icon}</div>
                            <div style={styles.name}>{type.name}</div>
                            <div style={styles.badge}>{type.venues.length} venues</div>
                        </div>
                    ))}
                </div>
            </div>

            {selectedVenueType && (
                <div style={styles.step}>
                    <h2 style={styles.stepTitle}>
                        Select Specific Venue
                        <span style={styles.badge}>
                            {venueTypes.find(t => t.id === selectedVenueType)?.name}
                        </span>
                    </h2>
                    
                    <div style={styles.grid}>
                        {selectedVenues.map(venue => (
                            <div
                                key={venue.id}
                                style={{
                                    ...styles.card,
                                    ...(selectedVenue === venue.name ? styles.selectedCard : {})
                                }}
                                onClick={() => setSelectedVenue(venue.name)}
                            >
                                <div style={styles.name}>{venue.name}</div>
                                <div style={styles.capacity}>
                                    Capacity: {venue.capacity}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <button 
                style={{
                    ...styles.continueButton,
                    ...(isContinueDisabled ? styles.disabledButton : {})
                }}
                onClick={handleContinue}
                disabled={isContinueDisabled}
            >
                Continue to Booking Form →
            </button>
        </div>
    );
}


export default Booking;