import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

class Node {
    constructor(data) {
        this.data = data;
        this.next = null;
    }
}

// Used to store and traverse the schedule of bookings for the day
class BookingLinkedList {
    constructor() {
        this.head = null;
        this.size = 0;
    }

    // Insert sorted by start time
    addSorted(booking) {
        const newNode = new Node(booking);
        
        // If list is empty or new booking is earlier than head
        if (!this.head || booking.start < this.head.data.start) {
            newNode.next = this.head;
            this.head = newNode;
        } else {
            let current = this.head;
            // Traverse to find correct position
            while (current.next && current.next.data.start < booking.start) {
                current = current.next;
            }
            newNode.next = current.next;
            current.next = newNode;
        }
        this.size++;
    }

    // Convert to Array for React Rendering
    toArray() {
        const arr = [];
        let current = this.head;
        while (current) {
            arr.push(current.data);
            current = current.next;
        }
        return arr;
    }
}

function Dashboard() {
    const navigate = useNavigate();

    const [venues, setVenues] = useState([]); // Array
    const [venueLookup, setVenueLookup] = useState({}); // Dictionary
    
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedVenueId, setSelectedVenueId] = useState('');
    
    const [scheduleList, setScheduleList] = useState(new BookingLinkedList()); // Linked List
    const [currentVenueStatus, setCurrentVenueStatus] = useState(null);
    const [hasSearched, setHasSearched] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // --- STYLES ---
    const s = {
        container: { maxWidth: '900px', margin: '40px auto', padding: '30px', fontFamily: 'Arial, sans-serif', background: '#f8fafc', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' },
        header: { textAlign: 'center', color: '#2c5282', marginBottom: '30px' },
        controlPanel: { display: 'flex', gap: '20px', background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', flexWrap: 'wrap' },
        inputGroup: { flex: 1, minWidth: '200px' },
        label: { display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#4a5568', fontSize: '14px' },
        input: { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '16px' },
        btn: { padding: '12px 24px', background: '#3182ce', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', height: '42px', marginTop: '23px' },
        
        resultSection: { marginTop: '30px', background: 'white', padding: '25px', borderRadius: '10px', border: '1px solid #e2e8f0' },
        statusBadge: (status) => ({
            display: 'inline-block', padding: '6px 12px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold',
            background: status === 'Available' ? '#c6f6d5' : '#fed7d7',
            color: status === 'Available' ? '#22543d' : '#822727', marginBottom: '20px'
        }),
        timelineItem: { display: 'flex', borderLeft: '4px solid #4299e1', paddingLeft: '15px', marginBottom: '15px', paddingBottom: '15px' },
        time: { minWidth: '120px', fontWeight: 'bold', color: '#2b6cb0' },
        details: { color: '#4a5568' },
        
        actionButtons: { display: 'flex', gap: '15px', marginTop: '30px', justifyContent: 'center' },
        primaryBtn: { padding: '12px 30px', background: '#38a169', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' },
        secondaryBtn: { padding: '12px 30px', background: '#718096', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' },
    };

    // 1. Fetch Venues on Load
    useEffect(() => {
        const loadVenues = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/venues');
                setVenues(res.data); // Store as Array

                const lookup = {};
                res.data.forEach(v => {
                    lookup[v.id] = v;
                });
                setVenueLookup(lookup);

            } catch (err) { console.error(err); }
        };
        loadVenues();
    }, []);

    // 2. Check Availability & Fetch Schedule
    const handleCheckSchedule = async () => {
        if (!selectedDate || !selectedVenueId) {
            alert("Please select both a date and a venue.");
            return;
        }
        setIsLoading(true);
        setHasSearched(true);

        try {
            // Check global status via Dictionary lookup first (Client side check)
            const venueBasicInfo = venueLookup[selectedVenueId];
            if (venueBasicInfo && venueBasicInfo.status !== 'Available') {
                // If globally closed, we might still want to show schedule, 
                // but usually we warn the user immediately.
                // For this logic, we continue to fetch the specific day details.
            }

            // Fetch Data from Backend
            const res = await axios.get(`http://localhost:5000/api/venue-daily-schedule?venue_id=${selectedVenueId}&date=${selectedDate}`);
            
            const { venue, schedule } = res.data;
            setCurrentVenueStatus(venue);

            // Populate Linked List
            const list = new BookingLinkedList();
            schedule.forEach(booking => {
                list.addSorted(booking);
            });
            setScheduleList(list);

        } catch (error) {
            console.error(error);
            alert("Failed to load schedule.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={s.container}>
            <h1 style={s.header}>Check Venue Availability</h1>

            {/* CONTROL PANEL */}
            <div style={s.controlPanel}>
                <div style={s.inputGroup}>
                    <label style={s.label}>Select Date</label>
                    <input 
                        type="date" 
                        style={s.input} 
                        value={selectedDate} 
                        onChange={e => setSelectedDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                    />
                </div>

                <div style={s.inputGroup}>
                    <label style={s.label}>Select Venue</label>
                    <select 
                        style={s.input} 
                        value={selectedVenueId} 
                        onChange={e => setSelectedVenueId(e.target.value)}
                    >
                        <option value="">-- Choose Venue --</option>
                        {venues.map(v => (
                            <option key={v.id} value={v.id}>{v.name} ({v.type})</option>
                        ))}
                    </select>
                </div>

                <button style={s.btn} onClick={handleCheckSchedule}>
                    Check Schedule
                </button>
            </div>

            {/* RESULTS SECTION */}
            {hasSearched && (
                <div style={s.resultSection}>
                    {isLoading ? <p>Loading...</p> : (
                        <>
                            {/* Venue Status Header */}
                            <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '15px', marginBottom: '20px' }}>
                                <h2 style={{ margin: '0 0 10px 0', color: '#2d3748' }}>
                                    {currentVenueStatus?.name}
                                </h2>
                                <span style={s.statusBadge(currentVenueStatus?.status)}>
                                    Availability Status: {currentVenueStatus?.status}
                                </span>
                                <p style={{ margin: '5px 0', color: '#718096' }}>
                                    Capacity: {currentVenueStatus?.capacity} people
                                </p>
                            </div>

                            {/* Schedule List (Rendered from Linked List) */}
                            <h3 style={{ color: '#2b6cb0' }}>📅 Schedule for {selectedDate}</h3>
                            
                            {scheduleList.size === 0 ? (
                                <p style={{ fontStyle: 'italic', color: '#718096', padding: '20px', textAlign: 'center', background: '#edf2f7', borderRadius: '8px' }}>
                                    No approved bookings for this date. The venue is free all day!
                                </p>
                            ) : (
                                <div>
                                    {scheduleList.toArray().map((booking, index) => (
                                        <div key={index} style={s.timelineItem}>
                                            <div style={s.time}>
                                                {booking.start} - {booking.end}
                                            </div>
                                            <div style={s.details}>
                                                <strong>{booking.event}</strong>
                                                <div style={{ fontSize: '13px' }}>Organized by: {booking.organizer}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div style={s.actionButtons}>
                                <button 
                                    style={s.secondaryBtn}
                                    onClick={() => navigate('/homepage')}
                                >
                                    ← Back to Home
                                </button>
                                
                                {currentVenueStatus?.status === 'Available' && (
                                    <button 
                                        style={s.primaryBtn}
                                        onClick={() => navigate('/booking')}
                                    >
                                        Book This Venue Now →
                                    </button>
                                )}
                            </div>
                        </>
                    )}
                </div>
            )}
            
            {!hasSearched && (
                <button 
                    style={s.backButton || { ...s.secondaryBtn, display: 'block', margin: '30px auto' }}
                    onClick={() => navigate('/homepage')}
                >
                    Back to Home
                </button>
            )}
        </div>
    );
}

export default Dashboard;