import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Calendar() {
    const navigate = useNavigate();
    const [currentDate, setCurrentDate] = useState(new Date());

    
    const pageStyle = {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #2419F0, #6F58FF)',
        padding: '40px 20px',
        fontFamily: 'Arial, sans-serif'
    };

    const calendarCard = {
        maxWidth: '900px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '15px',
        padding: '30px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
    };

    
    const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    const days = [];
    
    for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(<div key={`empty-${i}`} style={{ padding: '20px' }}></div>);
    }
    
    for (let d = 1; d <= daysInMonth(currentDate.getFullYear(), currentDate.getMonth()); d++) {
        days.push(
            <div key={d} style={{
                padding: '20px',
                border: '1px solid #e2e8f0',
                textAlign: 'center',
                borderRadius: '8px',
                backgroundColor: d === new Date().getDate() ? '#ebf8ff' : 'transparent',
                fontWeight: d === new Date().getDate() ? 'bold' : 'normal'
            }}>
                {d}
                {/* Future: Add small dots here if there is a booking in vems.db */}
            </div>
        );
    }

    return (
        <div style={pageStyle}>
            <div style={calendarCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <button onClick={() => navigate('/homepage')} style={{ padding: '10px 20px', cursor: 'pointer', borderRadius: '5px', border: '1px solid #2b6cb0', color: '#2b6cb0' }}>
                        ← Back to Home
                    </button>
                    <h2 style={{ color: '#2b6cb0', margin: 0 }}>
                        {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
                    </h2>
                    <div style={{ width: '100px' }}></div> {/* Spacer */}
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    gap: '10px',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    color: '#4a5568',
                    marginBottom: '10px'
                }}>
                    <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px' }}>
                    {days}
                </div>
            </div>
        </div>
    );
}

export default Calendar;