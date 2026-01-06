import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Booking() {
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedVenueType, setSelectedVenueType] = useState('');
    const [selectedVenue, setSelectedVenue] = useState('');
    const [showCalendar, setShowCalendar] = useState(false);

    const formatDate = (date) => {
        return date.toLocaleDateString('en-GB', {
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric'    
        }).replace(/\//g, '/');
    };

    const venueTypes = [
        {
            id: 'hall',
            name: 'Hall',
            venues: [
                { id: 1, name: 'DTC Grand Hall', capacity: 5000 },
                { id: 2, name: 'Multi-purpose Hall', capacity: 200}
            ]
        },
        {
            id: 'lecture',
            name: 'Lecture Hall',
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
            venues: [
                { id: 8, name: 'Swimming Pool', capacity: 50},
                { id: 9, name: 'Basketball Court', capacity: 100 }
            ]
        },
        {
            id: 'fci',
            name: 'FCI',
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

    const handleContinue = () => {
         if (!selectedDate || !selectedVenueType || !selectedVenue) {
            alert('Please complete all selections');
            return;
        }

        const selectedType = venueTypes.find(t => t.id === selectedVenueType);
        const selectedVenueDetails = selectedType.venues.find(v => v.name === selectedVenue);

        navigate('/bookingform', {
            state: {
                date: selectedDate,
                venueType: selectedVenueType,
                venueTypeName: selectedType.name,
                venue: selectedVenue,
                venueDetails: selectedVenueDetails,
            }
        });
    };

    const renderCalendar = () => {
        if (!showCalendar) return null;

        const today = new Date();
        const currentYear = selectedDate.getFullYear();
        const currentMonth = selectedDate.getMonth();
        
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
        
        const days = [];
        
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-${i}`} style={emptyDayStyle}></div>);
        }
        
        for (let day = 1; day <= daysInMonth; day++) {
            const isSelected = day === selectedDate.getDate() && 
                              currentMonth === selectedDate.getMonth() &&
                              currentYear === selectedDate.getFullYear();
            
            days.push(
                <div
                    key={day}
                    style={{
                        ...dayStyle,
                        ...(isSelected ? selectedDayStyle: {})
                    }}
                    onClick={() => {
                        setSelectedDate(new Date(currentYear, currentMonth, day));
                        setShowCalendar(false);
                    }}
                >
                    {day}
                </div>
            );
        }

        return (
             <div style={calendarOverlayStyle} onClick={() => setShowCalendar(false)}>
                <div style={calendarContainerStyle} onClick={(e) => e.stopPropagation()}>
                     <div style={calendarHeaderStyle}>
                        <h3 style={calendarTitleStyle}>
                            {currentYear} {currentMonth + 1}
                        </h3>
                        <button 
                             style={closeButtonStyle}
                            onClick={() => setShowCalendar(false)}
                        >
                            ×
                        </button>
                    </div>
                    
                     <div style={weekdaysStyle}>
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                            <div key={day} style={weekdayStyle}>{day}</div>
                        ))}
                    </div>
                    
                    <div style={daysGridStyle}>
                        {days}
                    </div>
                </div>
            </div>
        );
    };

    const selectedVenues = selectedVenueType 
        ? venueTypes.find(t => t.id === selectedVenueType)?.venues || []
        : [];

    const isContinueDisabled = !selectedDate || !selectedVenueType || !selectedVenue;

    const containerStyle = {
        maxWidth: '1000px',
        margin: '40px auto',
        padding: '30px',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        fontFamily: 'Arial, sans-serif'
    };

    const headerStyle = {
        textAlign: 'center',
        marginBottom: '30px'
    };

     const titleStyle = {
        fontSize: '28px',
        fontWeight: 'bold',
        color: '#2b6cb0',
        marginBottom: '10px'
    };

    const subtitleStyle = {
        color: '#4a5568',
        fontSize: '16px'
    };
        
    const stepContainerStyle = {
        backgroundColor: '#e0f0fbff',
        padding: '25px',
        borderRadius: '10px',
        marginBottom: '25px'
    };

    const stepTitleStyle = {
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#2d3748',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '10px'
    };
        
     const typeIndicatorStyle = {
        fontSize: '14px',
        color: '#718096',
        fontWeight: 'normal',
        backgroundColor: '#e2e8f0',
        padding: '5px 10px',
        borderRadius: '20px'
    };

    const inputGroupStyle = {
        marginBottom: '25px'
    };

    const labelStyle = {
        display: 'block',
        fontSize: '14px',
        fontWeight: '600',
        color: '#4a5568',
        marginBottom: '8px'
    };

    const dateInputStyle = {
        width: '100%',
        maxWidth: '300px',
        padding: '12px',
        border: '1px solid #b5babeff',
        borderRadius: '6px',
        fontSize: '16px',
        cursor: 'pointer',
        backgroundColor: 'white'
    };

    const typeGridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gap: '15px'
    };
        
    const typeCardStyle = {
        backgroundColor: 'white',
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
        alignItems: 'center',
        outline: 'none'
    };

    const selectTypeCardStyle = {
        borderColor:  '#38a169',
        backgroundColor: '#f0fff4',
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(125, 125, 125, 0)'
    };

    const typeIconStyle = {
        fontSize: '32px',
        marginBottom: '10px'
    };

    const typeNameStyle = {
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#2d3748',
        marginBottom: '8px'
    };

    const typeCountStyle = {
        fontSize: '11px',
        color: '#38a169',
        backgroundColor: '#f0fff4',
        padding: '3px 8px',
        borderRadius: '12px'
    };

    const venueGridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '15px'
    };

    const venueCardStyle = {
        backgroundColor: 'white',
        border: '2px solid #e2e8f0',
        borderRadius: '10px',
        padding: '20px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        textAlign: 'center',
        outline: 'none'
    };

    const selectedVenueCardStyle = {
        borderColor: '#38a169',
        backgroundColor: '#f0fff4',
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(56, 161, 105, 0.15)'
    };

    const venueNameStyle = {
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#2d3748',
        marginBottom: '10px'
    };
    
    const venueCapacityStyle = {
        fontSize: '14px',
        color: '#4a5568'
    };
    
    const continueButtonStyle = {
        width: '100%',
        padding: '15px',
        backgroundColor: '#2b6cb0',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '18px',
        fontWeight: 'bold',
        cursor: 'pointer',
        marginTop: '20px',
        transition: 'background-color 0.3s'
    };
        
    const disabledButtonStyle = {
        backgroundColor: '#cbd5e0',
        cursor: 'not-allowed'
    };

    const calendarOverlayStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
    };

    const calendarContainerStyle = {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '25px',
        width: '400px',
        maxWidth: '90vw'
    };

    const calendarHeaderStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
    };

    const calendarTitleStyle = {
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#2d3748',
        margin: 0
    };

    const closeButtonStyle = {
        padding: '8px 16px',
        backgroundColor: '#e53e3e',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '18px'
    };

    const weekdaysStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '5px',
        marginBottom: '10px'
    };

    const weekdayStyle = {
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#718096',
        padding: '10px 0'
    };

    const daysGridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '5px'
    };

    const dayStyle = {
        textAlign: 'center',
        padding: '12px',
        borderRadius: '6px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        backgroundColor: 'white',
        border: '1px solid #e2e8f0'
    };
    
    const selectedDayStyle = {
        backgroundColor: '#4299e1',
        color: 'white',
         borderColor: '#4299e1'
    };
    
    const emptyDayStyle = {
        padding: '12px'
    };
    
    return (
        <div style={containerStyle}>
            <div style={headerStyle}>
                <h1 style={titleStyle}>Campus Venue Booking System</h1>
                <p style={subtitleStyle}>Choose date, venue type, and venue</p>
            </div>

             <div style={stepContainerStyle}>
               <h2 style={stepTitleStyle}>Select Date</h2>
                 <div style={inputGroupStyle}>
                    <label style={labelStyle}>Booking Date *</label>
                    <input
                        type="text"
                        style={dateInputStyle}
                        value={formatDate(selectedDate)}
                        readOnly
                        onClick={() => setShowCalendar(true)}
                        placeholder="Click to select date"
                    />
                </div>
            </div>

            <div style={stepContainerStyle}>
                <h2 style={stepTitleStyle}>Select Venue Type</h2>
                <div style={typeGridStyle}>
                    {venueTypes.map(type => (
                        <div
                            key={type.id}
                            style={{
                                ...typeCardStyle,
                                ...(selectedVenueType === type.id ? selectTypeCardStyle: {})
                            }}
                            onClick={() => {
                                setSelectedVenueType(type.id);
                                setSelectedVenue('');
                            }}
                        >
                            <div style={typeIconStyle}>
                                {type.id === 'hall' && '🏛️'}
                                {type.id === 'lecture' && '📚'}
                                {type.id === 'sport' && '⚽️'}
                                {type.id === 'fci'&& '💻'}

                            </div>
                            <div style={typeNameStyle}>{type.name}</div>
                            <div style={typeCountStyle}>{type.venues.length} venues</div>
                        </div>
                    ))}
                </div>
            </div>

            {selectedVenueType && (
                <div style={stepContainerStyle}>
                    <h2 style={stepTitleStyle}>
                        Select Specific Venue
                        <span style={typeIndicatorStyle}>
                            {venueTypes.find(t => t.id === selectedVenueType)?.name}
                        </span>
                    </h2>
                    
                    <div style={venueGridStyle}>
                        {selectedVenues.map(venue => (
                            <div
                                key={venue.id}
                                style={{
                                    ...venueCardStyle,
                                    ...(selectedVenue === venue.name ?selectedVenueCardStyle: {})
                                }}
                                onClick={() => setSelectedVenue(venue.name)}
                            >
                                <div style={venueNameStyle}>{venue.name}</div>
                                <div style={venueCapacityStyle}>
                                    Capacity: {venue.capacity}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <button 
                style={{
                    ...continueButtonStyle,
                    ...(isContinueDisabled ? disabledButtonStyle : {})
                }}
                onClick={handleContinue}
                disabled={isContinueDisabled}
            >
                Continue to Booking Form →
            </button>

            {renderCalendar()}
        </div>
    );
}


export default Booking;