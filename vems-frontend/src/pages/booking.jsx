import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Booking() {
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedVenueType, setSelectedVenueType] = useState('');
    const [selectedVenue, setSelectedVenue] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState(''); 
    const [timeError, setTimeError] = useState('');

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

        timeInput: {
            width: '100%',
            maxWidth: '150px',
            padding: '12px',
            border: '1px solid #b5babe',
            borderRadius: '6px',
            fontSize: '16px',
            background: 'white',
            marginRight: '15px'
        },

        timeContainer: {
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            flexWrap: 'wrap'
        },

        timeGroup: {
            display: 'flex',
            flexDirection: 'column',
            gap: '5px'
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
        },

        errorText: {
            color: '#e53e3e',
            fontSize: '14px',
            marginTop: '5px',
            marginBottom: '0'
        },

        timeHint: {
            fontSize: '12px',
            color: '#718096',
            marginTop: '8px',
            padding: '8px',
            background: '#f7fafc',
            borderRadius: '6px',
            borderLeft: '3px solid #4299e1'
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

    const parseTimeToMinutes = (timeStr) => {
        if (!timeStr) return 0;
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    };

    const calculateDuration = () => {
        const startTotal = parseTimeToMinutes(startTime);
        const endTotal = parseTimeToMinutes(endTime);
        const duration = endTotal - startTotal;
        const hours = Math.floor(duration / 60);
        const minutes = duration % 60;
        return `${hours}hours${minutes > 0 ? ` ${minutes}minutes` : ''}`;
    };

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    const validateTime = (time) => {
        if (!time) return 'Time is required';
        
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;
        if (!timeRegex.test(time)) {
            return 'Format must be HH:MM (24-hour)';
        }
        
        const minutes = parseInt(time.split(':')[1]);
        const validMinutes = [0, 15, 30, 45];
        
        if (!validMinutes.includes(minutes)) {
            return 'Minutes must be 00, 15, 30, or 45';
        }
        
        return '';
    };

    const validateTimeRange = (start, end) => {
        if (!start || !end) return '';
        
        const startTotal = parseTimeToMinutes(start);
        const endTotal = parseTimeToMinutes(end);
        
        if (endTotal <= startTotal) {
            return 'End time must be later than start time';
        }
        
        const duration = endTotal - startTotal;

        if (duration < 30) {
            return 'Minimum booking duration is 30 minutes';
        }
        
        if (duration > 6 * 60) {
            return 'Maximum booking duration is 6 hours';
        }
        
        if (startTotal < 8 * 60 || startTotal > 22 * 60 - 30) {
            return 'Booking must start between 08:00 and 21:30';
        }
        
        if (endTotal > 22 * 60) {
            return 'Booking must end by 22:00';
        }
        
        return '';
    };

    const handleStartTimeChange = (e) => {
        const time = e.target.value;
        setStartTime(time);
      
        const timeError = validateTime(time);
    
        let rangeError = '';
        if (endTime && !timeError) {
            rangeError = validateTimeRange(time, endTime);
        }
        
        setTimeError(timeError || rangeError);
    };

    const handleEndTimeChange = (e) => {
        const time = e.target.value;
        setEndTime(time);

        const timeError = validateTime(time);
        
        let rangeError = '';
        if (startTime && !timeError) {
            rangeError = validateTimeRange(startTime, time);
        }
        
        setTimeError(timeError || rangeError);
    };

    const handleContinue = () => {
        if (!selectedDate || !selectedVenueType || !selectedVenue || !startTime || !endTime) {
            alert('Please complete all selections');
            return;
        }

        const startError = validateTime(startTime);
        const endError = validateTime(endTime);
        
        if (startError || endError) {
            alert(`Time format error: ${startError || endError}`);
            return;
        }

        const rangeError = validateTimeRange(startTime, endTime);
        if (rangeError) {
            alert(`Time range error: ${rangeError}`);
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
                formattedDate: selectedDate,
                startTime: startTime, 
                endTime: endTime,
                duration: calculateDuration()
            }
        });
    };

    const selectedVenues = selectedVenueType 
        ? venueTypes.find(t => t.id === selectedVenueType)?.venues || []
        : [];

    const isContinueDisabled = !selectedDate || !selectedVenueType || !selectedVenue || !startTime || !endTime || timeError;

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

            {selectedVenue && (
                <div style={styles.step}>
                    <h2 style={styles.stepTitle}>Select Time Slot</h2>
                    
                    <div style={styles.timeContainer}>
                        <div style={styles.timeGroup}>
                            <label style={styles.label}>Start Time *</label>
                            <input
                                type="text"
                                style={styles.timeInput}
                                value={startTime}
                                onChange={handleStartTimeChange}
                                placeholder="HH:MM"
                                maxLength="5"
                            />
                        </div>
                        
                        <div style={{ fontSize: '20px', color: '#4a5568' }}>→</div>
                        
                        <div style={styles.timeGroup}>
                            <label style={styles.label}>End Time *</label>
                            <input
                                type="text"
                                style={styles.timeInput}
                                value={endTime}
                                onChange={handleEndTimeChange}
                                placeholder="HH:MM"
                                maxLength="5"
                            />
                        </div>
                    </div>
                    
                    {timeError && (
                        <p style={styles.errorText}>⚠️ {timeError}</p>
                    )}
                    
                    <div style={styles.timeHint}>
                        <strong>Time format requirements:</strong>
                        <ul style={{ margin: '5px 0 0 20px', padding: '0' }}>
                            <li>24-hour format (HH:MM)</li>
                            <li>Minutes must be: 00, 15, 30, or 45</li>
                            <li>Operating hours: 08:00 - 22:00 daily</li>
                            <li>Minimum duration: 30 minutes</li>
                            <li>Maximum duration: 6 hours</li>
                            <li>Example: 09:00, 14:30, 18:45</li>
                            <li>Invalid examples: 09:10, 14:23, 18:59</li>
                        </ul>
                    </div>
                    
                    {startTime && endTime && !timeError && (
                        <div style={{ fontSize: '14px', color: '#38a169', marginTop: '10px' }}>
                            <p>✅ Selected: {startTime} - {endTime}</p>
                            <p>📅 Duration: {calculateDuration()}</p>
                        </div>
                    )}
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