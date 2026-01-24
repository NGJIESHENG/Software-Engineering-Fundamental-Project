import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Booking() {
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedVenueType, setSelectedVenueType] = useState('');
    const [selectedVenue, setSelectedVenue] = useState('');
    const [selectedVenueId, setSelectedVenueId] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState(''); 
    const [timeError, setTimeError] = useState('');
    const [availabilityStatus, setAvailabilityStatus] = useState('');
    const [venueTypes, setVenueTypes] = useState([]); 
    const [venues, setVenues] = useState([]); 
    const [isLoading, setIsLoading] = useState(false);
    const [venueDetails, setVenueDetails] = useState(null);

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

        unavailableCard: { 
            border: '2px dashed #cbd5e0',
            background: '#f7fafc',
            opacity: 0.7
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
        },
        statusBadge: {
            fontSize: '11px',
            padding: '3px 8px',
            borderRadius: '12px',
            marginTop: '5px',
            display: 'inline-block'
        }
    };

    useEffect(() => {
        fetchVenueTypes();
    }, []);

    useEffect(() => {
        if (selectedVenueType) {
            fetchVenuesByType(selectedVenueType);
        }
    }, [selectedVenueType]);

    useEffect(() => {
        if (selectedDate && selectedVenueId && startTime && endTime && !timeError) {
            checkAvailability();
        } else {
            setAvailabilityStatus('');
        }
    }, [selectedDate, selectedVenueId, startTime, endTime, timeError]);

    const fetchVenueTypes = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get('http://localhost:5000/api/venue-types');
            
            const typesWithIcons = response.data.map(type => {
                let icon = '🏛️'; 
                switch(type.name.toLowerCase()) {
                    case 'hall':
                        icon = '🏛️';
                        break;
                    case 'lecture hall':
                        icon = '📚';
                        break;
                    case 'sports facility':
                        icon = '⚽️';
                        break;
                    case 'fci':
                        icon = '💻';
                        break;
                }
                
                return {
                    ...type,
                    icon: icon
                };
            });
            
            setVenueTypes(typesWithIcons);
        } catch (error) {
            console.error('Error fetching venue types:', error);
            alert('Failed to load venue types');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchVenuesByType = async (typeId) => {
        try {
            setIsLoading(true);
            const response = await axios.get(`http://localhost:5000/api/venues-by-type/${typeId}`);
            const sortedVenues = response.data.sort((a, b) => {
                if (a.status === 'Available' && b.status !== 'Available') return -1;
                if (a.status !== 'Available' && b.status === 'Available') return 1;
                return 0;
            });
            
            setVenues(sortedVenues);
        } catch (error) {
            console.error('Error fetching venues:', error);
            alert('Failed to load venues');
        } finally {
            setIsLoading(false);
        }
    };

    const checkAvailability = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/check-availability', {
                date: selectedDate,
                venue_id: selectedVenueId,
                start_time: startTime,
                end_time: endTime
            });
            
            if (response.data.available) {
                setAvailabilityStatus('✅ This time slot is available!');
            } else {
                if (response.data.reason && response.data.reason.includes('Venue is currently')) {
                    setAvailabilityStatus(`❌ ${response.data.reason}. Please select another venue.`);
                } 
                else if (response.data.conflicts && response.data.conflicts.length > 0) {
                    setAvailabilityStatus('❌ This time slot is not available');
                } else {
                    setAvailabilityStatus(`❌ ${response.data.reason || 'Not available'}`);
                }
            }
        } catch (error) {
            console.error('Error checking availability:', error);
            setAvailabilityStatus('⚠️ Unable to check availability');
        }
    };

    const handleVenueSelect = (venue) => {
        if (venue.status !== 'Available') {
            alert(`This venue is currently ${venue.status}. Please select another venue.`);
            return;
        }

        setSelectedVenue(venue.name);
        setSelectedVenueId(venue.id);
        setVenueDetails(venue);
    };

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

    const handleContinue = async () => {
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

        try {
            const response = await axios.post('http://localhost:5000/api/check-availability', {
                date: selectedDate,
                venue_id: selectedVenueId,
                start_time: startTime,
                end_time: endTime
            });
            
            if (!response.data.available) {
                alert('This venue is no longer available at the selected time. Please choose another time.');
                return;
            }

            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            
            if (!currentUser) {
                alert('Please login to continue');
                navigate('/login');
                return;
            }

            const type = venueTypes.find(t => t.id === selectedVenueType);
            const dateObj = new Date(selectedDate);

            navigate('/bookingform', {
                state: {
                    date: dateObj,
                    venueType: selectedVenueType,
                    venueTypeName: type ? type.name : selectedVenueType,
                    venue: selectedVenue,
                    venueId: selectedVenueId,
                    venueDetails: venueDetails,
                    formattedDate: selectedDate,
                    startTime: startTime, 
                    endTime: endTime,
                    duration: calculateDuration(),
                    user: currentUser
                }
            });

        } catch (error) {
            console.error('Error checking availability:', error);
            alert('Unable to verify availability. Please try again.');
        }
    };

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

    const getStatusColor = (status) => {
        switch(status) {
            case 'Available': return '#38a169';
            case 'Maintenance': return '#dd6b20';
            case 'Closed': return '#e53e3e';
            case 'Reserved': return '#805ad5';
            default: return '#718096';
        }
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
                {isLoading ? (
                    <p>Loading venue types...</p>
                ) : (
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
                                    setSelectedVenueId('');
                                }}
                            >
                                <div style={styles.icon}>{type.icon}</div>
                                <div style={styles.name}>{type.name}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {selectedVenueType && (
                <div style={styles.step}>
                    <h2 style={styles.stepTitle}>
                        Select Specific Venue
                        <span style={styles.badge}>
                            {venueTypes.find(t => t.id === selectedVenueType)?.name}
                        </span>
                    </h2>
                    
                    {isLoading ? (
                        <p>Loading venues...</p>
                    ) : (
                        <div style={styles.grid}>
                            {venues.map(venue => (
                                <div
                                    key={venue.id}
                                    style={{
                                        ...styles.card,
                                        ...(selectedVenue === venue.name ? styles.selectedCard : {}),
                                        ...(venue.status !== 'Available' ? styles.unavailableCard : {}),
                                        cursor: venue.status === 'Available' ? 'pointer' : 'not-allowed'
                                    }}
                                    onClick={() => handleVenueSelect(venue)}
                                >
                                    <div style={styles.name}>{venue.name}</div>
                                    <div style={styles.capacity}>
                                        Capacity: {venue.capacity}
                                    </div>
                                     <div style={{
                                        ...styles.statusBadge,
                                        background: getStatusColor(venue.status),
                                        color: 'white'
                                    }}>
                                        {venue.status}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
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
                    
                    {availabilityStatus && (
                        <div style={{
                            padding: '15px',
                            background: availabilityStatus.includes('✅') ? '#f0fff4' : '#fed7d7',
                            borderRadius: '8px',
                            marginTop: '15px',
                            border: `1px solid ${availabilityStatus.includes('✅') ? '#38a169' : '#e53e3e'}`
                        }}>
                            {availabilityStatus}
                        </div>
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
            <button 
                style={styles.continueButton} 
                onClick={() => navigate('/homepage')}
            >
                ← Back to Home
            </button>
        </div>
    );
}

export default Booking;