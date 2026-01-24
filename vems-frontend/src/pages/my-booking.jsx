import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function MyBooking() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('pending');
    const [pendingBookings, setPendingBookings] = useState([]);
    const [approvedBookings, setApprovedBookings] = useState([]);
    const [rejectedBookings, setRejectedBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [hoveredCard, setHoveredCard] = useState(null);
    const [user, setUser] = useState(null);
    const [allBookings, setAllBookings] = useState([]);

    // --- INTERNAL STYLES ---
    const styles = {
        container: { maxWidth: '1200px', margin: '40px auto', padding: '30px', background: 'white', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', fontFamily: 'Arial, sans-serif' },
        header: { textAlign: 'center', marginBottom: '30px', borderBottom: '2px solid #e2e8f0', paddingBottom: '20px' },
        title: { fontSize: '28px', fontWeight: 'bold', color: '#2b6cb0', marginBottom: '10px' },
        subtitle: { color: '#4a5568', fontSize: '16px' },
        tabs: { display: 'flex', borderBottom: '2px solid #e2e8f0', marginBottom: '30px' },
        tab: { padding: '15px 30px', fontSize: '16px', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer', transition: 'all 0.3s' },
        activeTab: { color: '#2b6cb0', borderBottom: '3px solid #2b6cb0' },
        inactiveTab: { color: '#718096' },
        badge: { display: 'inline-block', marginLeft: '8px', padding: '2px 8px', fontSize: '12px', borderRadius: '12px', fontWeight: 'bold' },
        pendingBadge: { background: '#fed7d7', color: '#c53030' },
        approvedBadge: { background: '#c6f6d5', color: '#276749' },
        bookingGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' },
        bookingCard: { background: '#f8fafc', borderRadius: '10px', padding: '20px', border: '2px solid #e2e8f0', transition: 'all 0.3s', cursor: 'pointer' },
        hoveredCard: { transform: 'translateY(-3px)', boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)' },
        statusBadge: { padding: '4px 10px', borderRadius: '15px', fontSize: '11px', fontWeight: 'bold' },
        createButton: { display: 'block', margin: '0 auto 30px', padding: '12px 30px', background: '#38a169', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' },
        modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
        modalContainer: { background: 'white', borderRadius: '12px', padding: '30px', width: '90%', maxWidth: '600px', maxHeight: '80vh', overflowY: 'auto' },
        modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid #e2e8f0', paddingBottom: '15px' },
        backButton: { display: 'block', margin: '40px auto 0', padding: '12px 30px', background: '#718096', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.3s' },
    };

    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            navigate('/login');
            return;
        }
        setUser(currentUser);
    }, [navigate]);

    const fetchMyBookings = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
        const token = localStorage.getItem('token')?.replace(/"/g, '');
        const response = await axios.get(`http://localhost:5000/api/user-bookings/${user.User_ID}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
       if (response.data && response.data.bookings) {
    const freshData = response.data.bookings;
    
    setAllBookings(freshData);
    
    setPendingBookings(freshData.filter(b => b.status?.toUpperCase() === 'PENDING'));
    setApprovedBookings(freshData.filter(b => b.status?.toUpperCase() === 'APPROVED'));
    setRejectedBookings(freshData.filter(b => b.status?.toUpperCase() === 'REJECTED'));
}
    } catch (error) {
        console.error('Error fetching bookings:', error);
    } finally {
        setIsLoading(false);
    }
};

    useEffect(() => {
        if (user) fetchMyBookings();
    }, [user]);

    const currentBookings = 
    activeTab === 'pending' ? pendingBookings : 
    activeTab === 'approved' ? approvedBookings : 
    activeTab === 'rejected' ? rejectedBookings : [];

    const getStatusStyle = (status) => {
        if (status === 'Approved') return { background: '#c6f6d5', color: '#276749' };
        if (status === 'Rejected') return { background: '#fed7d7', color: '#c53030' };
        return { background: '#ebf8ff', color: '#2b6cb0' };
    };

    if (!user) return null;

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>My Bookings</h1>
                <p style={styles.subtitle}>Welcome, {user.Name}!</p>
            </div>

            <button style={styles.createButton} onClick={() => navigate('/booking')}>+ Create New Booking</button>

            {/* TAB NAVIGATION */}
            <div style={styles.tabs}>
                {['Pending', 'Approved', 'Rejected'].map(t => (
                    <button 
                        key={t}
                        style={{ 
                            ...styles.tab, 
                            
                            ...(activeTab === t.toLowerCase() ? styles.activeTab : styles.inactiveTab) 
                        }}
                        onClick={() => setActiveTab(t.toLowerCase())}
                    >
                        {t}
                    </button>
                ))}
            </div>

            {/* LISTING */}
            {isLoading ? <p style={{ textAlign: 'center' }}>Loading...</p> : (
                <div style={styles.bookingGrid}>
                    {currentBookings.map((b) => (
                        <div 
                            key={b.booking_id}
                            style={{ 
                                ...styles.bookingCard, 
                                borderLeft: b.status === 'Rejected' ? '6px solid #e53e3e' : '2px solid #e2e8f0',
                                ...(hoveredCard === b.booking_id && styles.hoveredCard)
                            }}
                            onMouseEnter={() => setHoveredCard(b.booking_id)}
                            onMouseLeave={() => setHoveredCard(null)}
                            onClick={() => setSelectedBooking(b)}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <span style={{ fontSize: '12px', color: '#718096' }}>#{b.booking_id}</span>
                                <span style={{ ...styles.statusBadge, ...getStatusStyle(b.status) }}>{b.status}</span>
                            </div>
                            <h3 style={{ margin: '0 0 10px 0' }}>{b.event_name}</h3>
                            <p style={{ fontSize: '14px', margin: '5px 0' }}>📍 {b.venue_name}</p>
                            <p style={{ fontSize: '14px', margin: '5px 0' }}>📅 {b.date}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* MODAL */}
            {selectedBooking && (
                <div style={styles.modalOverlay} onClick={() => setSelectedBooking(null)}>
                    <div style={styles.modalContainer} onClick={e => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h2>Booking Details</h2>
                            <button onClick={() => setSelectedBooking(null)} style={{ border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer' }}>×</button>
                        </div>
                        <p><strong>Event:</strong> {selectedBooking.event_name}</p>
                        <p><strong>Venue:</strong> {selectedBooking.venue_name}</p>
                        <p><strong>Date:</strong> {selectedBooking.date}</p>
                        
                        {selectedBooking.status === 'Approved' && (
                            <button style={styles.createButton} onClick={() => navigate('/modifydetails', {state: { bookingId: selectedBooking.booking_id } })}>
                                Modify
                            </button>
                        )}

                        {selectedBooking.status === 'Rejected' && (
                            <div style={{ marginTop: '20px', padding: '15px', background: '#fff5f5', borderRadius: '8px', borderLeft: '4px solid #c53030' }}>
                                <strong style={{ color: '#c53030' }}>Rejection Reason:</strong>
                                <p style={{ color: '#742a2a', marginTop: '5px' }}>{selectedBooking.rejection_reason || "No specific reason provided."}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
            <button 
                style={styles.backButton} 
                onClick={() => navigate('/homepage')}
            >
                ← Back to Home
            </button>
        </div>
    );

}
export default MyBooking;