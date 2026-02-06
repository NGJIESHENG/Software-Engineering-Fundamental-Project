import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Calendar() {
    const navigate = useNavigate();
    
    
    const [viewDate, setViewDate] = useState(new Date());
    
   
    const [selectedDate, setSelectedDate] = useState(new Date());
    
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

   
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    
    const years = Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - 5 + i); // Current year +/- 5

   
    useEffect(() => {
        fetchBookings(selectedDate);
    }, [selectedDate]);

    const fetchBookings = async (dateObj) => {
        setIsLoading(true);
        try {
            
            const offset = dateObj.getTimezoneOffset();
            const localDate = new Date(dateObj.getTime() - (offset * 60 * 1000));
            const dateStr = localDate.toISOString().split('T')[0];

            const response = await axios.get(`http://localhost:5000/api/bookings-by-date?date=${dateStr}`);
            setBookings(response.data);
        } catch (error) {
            console.error("Error fetching bookings:", error);
            setBookings([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleMonthChange = (e) => {
        const newDate = new Date(viewDate);
        newDate.setMonth(parseInt(e.target.value));
        setViewDate(newDate);
    };

    const handleYearChange = (e) => {
        const newDate = new Date(viewDate);
        newDate.setFullYear(parseInt(e.target.value));
        setViewDate(newDate);
    };

    const handleDayClick = (day) => {
        const newSelected = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        setSelectedDate(newSelected);
    };

    
    const pageStyle = {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #2419F0, #6F58FF)',
        padding: '40px 20px',
        fontFamily: 'Arial, sans-serif'
    };

    const calendarCard = {
        maxWidth: '1000px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '15px',
        padding: '30px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
        display: 'flex',
        flexDirection: 'column',
        gap: '30px'
    };

    const controlPanel = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        borderBottom: '1px solid #e2e8f0',
        paddingBottom: '20px'
    };

    const selectStyle = {
        padding: '8px 12px',
        fontSize: '16px',
        borderRadius: '6px',
        border: '1px solid #cbd5e0',
        marginLeft: '10px',
        cursor: 'pointer'
    };

    const gridHeader = {
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '10px',
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#4a5568',
        marginBottom: '10px'
    };

    const bookingsSection = {
        background: '#f7fafc',
        borderRadius: '10px',
        padding: '20px',
        border: '1px solid #e2e8f0'
    };

    const bookingItem = {
        background: 'white',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '10px',
        borderLeft: '4px solid #48bb78', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    };

    
    const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();

    const renderDays = () => {
        const days = [];
        
        
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-${i}`}></div>);
        }
        
        
        const totalDays = daysInMonth(viewDate.getFullYear(), viewDate.getMonth());
        
        for (let d = 1; d <= totalDays; d++) {
            const isSelected = 
                selectedDate.getDate() === d && 
                selectedDate.getMonth() === viewDate.getMonth() && 
                selectedDate.getFullYear() === viewDate.getFullYear();

            days.push(
                <div 
                    key={d} 
                    onClick={() => handleDayClick(d)}
                    style={{
                        padding: '15px',
                        border: isSelected ? '2px solid #3182ce' : '1px solid #e2e8f0',
                        textAlign: 'center',
                        borderRadius: '8px',
                        backgroundColor: isSelected ? '#ebf8ff' : 'white',
                        fontWeight: isSelected ? 'bold' : 'normal',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        color: '#2d3748'
                    }}
                    onMouseEnter={(e) => { if(!isSelected) e.currentTarget.style.backgroundColor = '#f7fafc'}}
                    onMouseLeave={(e) => { if(!isSelected) e.currentTarget.style.backgroundColor = 'white'}}
                >
                    {d}
                </div>
            );
        }
        return days;
    };

    const formatDateDisplay = (date) => {
        return date.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    };

    return (
        <div style={pageStyle}>
            <div style={calendarCard}>
                
              
                <div style={controlPanel}>
                    <button onClick={() => navigate('/homepage')} style={{ padding: '8px 16px', cursor: 'pointer', borderRadius: '5px', border: '1px solid #718096', background: 'white', color: '#4a5568' }}>
                        ← Back
                    </button>
                    
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <select value={viewDate.getMonth()} onChange={handleMonthChange} style={selectStyle}>
                            {months.map((m, index) => (
                                <option key={m} value={index}>{m}</option>
                            ))}
                        </select>
                        
                        <select value={viewDate.getFullYear()} onChange={handleYearChange} style={selectStyle}>
                            {years.map(y => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                    </div>
                </div>

              
                <div>
                    <div style={gridHeader}>
                        <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px' }}>
                        {renderDays()}
                    </div>
                </div>

               
                <div style={bookingsSection}>
                    <h3 style={{ marginTop: 0, color: '#2d3748', borderBottom: '2px solid #cbd5e0', paddingBottom: '10px' }}>
                        📅 Approved Events for {formatDateDisplay(selectedDate)}
                    </h3>
                    
                    {isLoading ? (
                        <p>Loading bookings...</p>
                    ) : bookings.length > 0 ? (
                        <div>
                            {bookings.map((booking) => (
                                <div key={booking.id} style={bookingItem}>
                                    <div>
                                        <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#2d3748' }}>{booking.event_name}</div>
                                        <div style={{ color: '#4a5568', fontSize: '14px', marginTop: '4px' }}>
                                            📍 {booking.venue} ({booking.venue_type})
                                        </div>
                                        <div style={{ color: '#718096', fontSize: '12px', marginTop: '4px' }}>
                                            Organized by: {booking.organizer}
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontWeight: 'bold', color: '#2b6cb0' }}>
                                            {booking.start_time} - {booking.end_time}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '20px', color: '#718096' }}>
                            <p style={{ fontSize: '40px', margin: '0 0 10px 0' }}>🗓️</p>
                            <p>No events found for this date.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Calendar;