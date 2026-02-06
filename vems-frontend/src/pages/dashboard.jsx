import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const navigate = useNavigate();

    
    const [searchParams, setSearchParams] = useState({ 
        date: '', 
        type: '', 
        capacity: '', 
        start_time: '08:00', 
        end_time: '10:00' 
    });
    const [availableVenues, setAvailableVenues] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    
    const s = {
        container: { maxWidth: '1000px', margin: '40px auto', padding: '30px', fontFamily: 'Arial, sans-serif', background: '#f8fafc' },
        header: { textAlign: 'center', color: '#2c5282', marginBottom: '30px' },
        searchCard: { 
            background: 'white', padding: '25px', borderRadius: '12px', 
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)', display: 'flex', 
            gap: '15px', alignItems: 'flex-end', marginBottom: '30px', flexWrap: 'wrap' 
        },
        inputGroup: { flex: '1 1 180px' },
        label: { display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '13px', color: '#4a5568' },
        input: { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '14px' },
        venueCard: { 
            background: 'white', padding: '20px', borderRadius: '10px', 
            border: '1px solid #e2e8f0', marginBottom: '15px', 
            display: 'flex', justifyContent: 'space-between', alignItems: 'center' 
        },
        statusBadge: (isAvailable) => ({ 
            padding: '4px 12px', borderRadius: '15px', fontSize: '12px', 
            fontWeight: 'bold', background: isAvailable ? '#c6f6d5' : '#fed7d7', 
            color: isAvailable ? '#22543d' : '#822727' 
        }),
        btn: { 
            padding: '12px 24px', background: '#3182ce', color: 'white', 
            border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' 
        },
        bookBtn: (isAvailable) => ({
            padding: '10px 20px', background: isAvailable ? '#38a169' : '#cbd5e0',
            color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold',
            cursor: isAvailable ? 'pointer' : 'not-allowed', marginTop: '10px'
        })
    };

    
    const handleSearch = async () => {
        if (!searchParams.date) return alert("Please select a date to check availability.");
        
        setIsLoading(true);
        setHasSearched(true);
        
        try {
            
            const res = await axios.get(`http://localhost:5000/api/venues/search-availability`, { 
                params: searchParams 
            });
            setAvailableVenues(res.data);
        } catch (err) {
            console.error("Search failed:", err);
            alert("Unable to fetch availability. Please ensure the backend is running.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={s.container}>
            <h1 style={s.header}>Venue Explorer & Availability</h1>

            
            <div style={s.searchCard}>
                <div style={s.inputGroup}>
                    <label style={s.label}>Required Date</label>
                    <input type="date" style={s.input} value={searchParams.date} 
                           min={new Date().toISOString().split('T')[0]}
                           onChange={e => setSearchParams({ ...searchParams, date: e.target.value })} />
                </div>
                <div style={s.inputGroup}>
                    <label style={s.label}>Category</label>
                    <select style={s.input} value={searchParams.type} 
                            onChange={e => setSearchParams({ ...searchParams, type: e.target.value })}>
                        <option value="">All Types</option>
                        <option value="Hall">Hall</option>
                        <option value="Lecture Hall">Lecture Hall</option>
                        <option value="Sports Facility">Sports Facility</option>
                        <option value="FCI">Computer Lab</option>
                    </select>
                </div>
                <div style={s.inputGroup}>
                    <label style={s.label}>Start Time</label>
                    <input type="time" style={s.input} value={searchParams.start_time} 
                           onChange={e => setSearchParams({ ...searchParams, start_time: e.target.value })} />
                </div>
                <div style={s.inputGroup}>
                    <label style={s.label}>End Time</label>
                    <input type="time" style={s.input} value={searchParams.end_time} 
                           onChange={e => setSearchParams({ ...searchParams, end_time: e.target.value })} />
                </div>
                <button style={s.btn} onClick={handleSearch}>Find Venues</button>
            </div>

          
            {hasSearched && (
                isLoading ? (
                    <div style={{textAlign: 'center', padding: '40px'}}>Searching availability...</div>
                ) : (
                    availableVenues.length === 0 ? (
                        <div style={{textAlign: 'center', color: '#718096'}}>No venues match your current filters.</div>
                    ) : (
                        availableVenues.map(venue => (
                            <div key={venue.id} style={s.venueCard}>
                                <div>
                                    <h3 style={{ margin: '0 0 5px 0' }}>{venue.name}</h3>
                                    <p style={{ fontSize: '14px', color: '#718096', margin: 0 }}>
                                        {venue.type} • Capacity: {venue.capacity} people
                                    </p>
                                    {!venue.is_available && (
                                        <small style={{ color: '#e53e3e', display: 'block', marginTop: '5px' }}>
                                            ⚠️ Unavailable during this specific time slot.
                                        </small>
                                    )}
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={s.statusBadge(venue.is_available)}>
                                        {venue.is_available ? "Available" : "Occupied"}
                                    </div>
                                    <button 
                                        disabled={!venue.is_available}
                                        style={s.bookBtn(venue.is_available)}
                                        onClick={() => navigate('/booking', { 
                                            state: { 
                                                venueId: venue.id, 
                                                date: searchParams.date,
                                                startTime: searchParams.start_time,
                                                endTime: searchParams.end_time
                                            } 
                                        })}
                                    >
                                        {venue.is_available ? "Book This Slot" : "Choose Another Time"}
                                    </button>
                                </div>
                            </div>
                        ))
                    )
                )
            )}
            
            <button 
                style={{ display: 'block', margin: '30px auto', background: 'none', border: 'none', color: '#3182ce', cursor: 'pointer', fontWeight: 'bold' }}
                onClick={() => navigate('/homepage')}
            >
                ← Return to Homepage
            </button>
        </div>
    );
}

export default Dashboard;