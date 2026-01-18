import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function MyBooking() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('pending');
    const [pendingBookings, setPendingBookings] = useState([]);
    const [approvedBookings, setApprovedBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [hoveredCard, setHoveredCard] = useState(null);
    const [user, setUser] = useState(null);
    const [allBookings, setAllBookings] = useState([]);

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
            const response = await axios.get(`http://localhost:5000/api/user-bookings/${user.User_ID}`);
            
            if (response.data && response.data.bookings) {
                const bookings = response.data.bookings;
                setAllBookings(bookings);
                
                const pending = bookings.filter(b => b.status === 'Pending');
                const approved = bookings.filter(b => b.status === 'Approved');
                
                setPendingBookings(pending);
                setApprovedBookings(approved);
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
            if (error.response?.status === 404) {
                setAllBookings([]);
                setPendingBookings([]);
                setApprovedBookings([]);
            } else {
                alert('Failed to load bookings. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchMyBookings();
        }
    }, [user]);

    const handleViewDetails = (booking) => {
        setSelectedBooking(booking);
    };

    const handleCloseDetails = () => {
        setSelectedBooking(null);
    };

    const handleCreateBooking = () => {
        navigate('/booking');
    };

    const currentBookings = activeTab === 'pending' ? pendingBookings : approvedBookings;

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-GB', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
        } catch (error) {
            return dateString;
        }
    };

    const formatDetailedDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-GB', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        } catch (error) {
            return dateString;
        }
    };

    const styles = {
        container: {
            maxWidth: '1200px',
            margin: '40px auto',
            padding: '30px',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            fontFamily: 'Arial, sans-serif'
        },
        header: {
            textAlign: 'center',
            marginBottom: '30px',
            borderBottom: '2px solid #e2e8f0',
            paddingBottom: '20px'
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
        tabs: {
            display: 'flex',
            borderBottom: '2px solid #e2e8f0',
            marginBottom: '30px'
        },
        tab: {
            padding: '15px 30px',
            fontSize: '16px',
            fontWeight: '600',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            position: 'relative',
            transition: 'all 0.3s'
        },
        activeTab: {
            color: '#2b6cb0',
            borderBottom: '3px solid #2b6cb0'
        },
        inactiveTab: {
            color: '#718096'
        },
        badge: {
            display: 'inline-block',
            marginLeft: '8px',
            padding: '2px 8px',
            fontSize: '12px',
            borderRadius: '12px',
            fontWeight: 'bold'
        },
        pendingBadge: {
            background: '#fed7d7',
            color: '#c53030'
        },
        approvedBadge: {
            background: '#c6f6d5',
            color: '#276749'
        },
        emptyState: {
            textAlign: 'center',
            padding: '60px 20px',
            color: '#718096'
        },
        emptyIcon: {
            fontSize: '60px',
            marginBottom: '20px',
            opacity: '0.5'
        },
        emptyText: {
            fontSize: '18px',
            marginBottom: '15px'
        },
        bookingGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px'
        },
        bookingCard: {
            background: '#f8fafc',
            borderRadius: '10px',
            padding: '20px',
            border: '2px solid #e2e8f0',
            transition: 'all 0.3s',
            cursor: 'pointer'
        },
        hoveredCard: { 
            transform: 'translateY(-3px)',
            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)'
        },
        pendingCard: {
            borderColor: '#fed7d7',
            background: '#fff5f5'
        },
        approvedCard: {
            borderColor: '#c6f6d5',
            background: '#f0fff4'
        },
        cardHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '15px'
        },
        bookingId: {
            fontSize: '12px',
            color: '#718096',
            fontWeight: '600'
        },
        statusBadge: {
            padding: '4px 10px',
            borderRadius: '15px',
            fontSize: '11px',
            fontWeight: 'bold'
        },
        pendingStatus: {
            background: '#fed7d7',
            color: '#c53030'
        },
        approvedStatus: {
            background: '#c6f6d5',
            color: '#276749'
        },
        draftStatus: {
            background: '#e2e8f0',
            color: '#4a5568'
        },
        cardContent: {
            marginBottom: '15px'
        },
        detailRow: {
            marginBottom: '8px'
        },
        detailLabel: {
            fontSize: '13px',
            color: '#718096',
            marginBottom: '3px'
        },
        detailValue: {
            fontSize: '16px',
            color: '#2d3748',
            fontWeight: '600'
        },
        createButton: {
            display: 'block',
            margin: '0 auto 30px',
            padding: '12px 30px',
            background: '#38a169',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'background 0.3s'
        },
        noteBox: {
            padding: '15px',
            background: '#f7fafc',
            borderRadius: '8px',
            borderLeft: '3px solid #4299e1',
            marginBottom: '25px',
            fontSize: '14px',
            color: '#4a5568'
        },
        modalOverlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        },
        modalContainer: {
            background: 'white',
            borderRadius: '12px',
            padding: '30px',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '80vh',
            overflowY: 'auto'
        },
        modalHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            paddingBottom: '15px',
            borderBottom: '2px solid #e2e8f0'
        },
        modalTitle: {
            fontSize: '22px',
            fontWeight: 'bold',
            color: '#2b6cb0'
        },
        closeButton: {
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#718096'
        },
        detailSection: {
            marginBottom: '25px'
        },
        sectionTitle: {
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#2d3748',
            marginBottom: '15px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
        },
        infoGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px'
        },
        infoItem: {
            marginBottom: '12px'
        },
        infoLabel: {
            fontSize: '14px',
            color: '#4a5568',
            fontWeight: '600',
            marginBottom: '5px'
        },
        infoValue: {
            fontSize: '16px',
            color: '#2d3748',
            padding: '8px',
            background: '#f8fafc',
            borderRadius: '6px'
        },
        textBlock: {
            padding: '12px',
            background: '#f8fafc',
            borderRadius: '6px',
            fontSize: '14px',
            color: '#2d3748',
            lineHeight: '1.6'
        },
        loadingState: {
            textAlign: 'center',
            padding: '60px 20px',
            color: '#4a5568'
        }
    };

    const getStatusInfo = (status) => {
        switch (status) {
            case 'Pending':
                return { style: styles.pendingStatus, text: 'Pending' };
            case 'Approved':
                return { style: styles.approvedStatus, text: 'Approved' };
            case 'Rejected':
                return { style: { background: '#fed7d7', color: '#c53030' }, text: 'Rejected' };
            case 'Cancelled':
                return { style: styles.draftStatus, text: 'Cancelled' };
            default:
                return { style: styles.draftStatus, text: status };
        }
    };

     if (!user) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <h3>Loading user information...</h3>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>My Bookings</h1>
                <p style={styles.subtitle}>
                    Welcome back, {user.Name}! Manage and track your venue bookings
                </p>
            </div>

            <div style={{
                background: '#e0f0fb',
                padding: '15px',
                borderRadius: '8px',
                marginBottom: '25px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div>
                    <p style={{ margin: '5px 0', fontSize: '14px', color: '#4a5568' }}>
                        <strong>User ID:</strong> {user.User_ID}
                    </p>
                    <p style={{ margin: '5px 0', fontSize: '14px', color: '#4a5568' }}>
                        <strong>Email:</strong> {user.Email}
                    </p>
                    <p style={{ margin: '5px 0', fontSize: '14px', color: '#4a5568' }}>
                        <strong>Role:</strong> {user.Role}
                    </p>
                </div>
                <div>
                    <p style={{ margin: '5px 0', fontSize: '14px', color: '#4a5568', textAlign: 'right' }}>
                        <strong>Total Bookings:</strong> {allBookings.length}
                    </p>
                    <p style={{ margin: '5px 0', fontSize: '14px', color: '#4a5568', textAlign: 'right' }}>
                        <strong>Pending:</strong> {pendingBookings.length} | <strong>Approved:</strong> {approvedBookings.length}
                    </p>
                </div>
            </div>

             <button 
                style={styles.createButton}
                onClick={handleCreateBooking}
            >
                + Create New Booking
            </button>

            <div style={styles.noteBox}>
                <strong>📋 How it works:</strong>
                <ul style={{ margin: '10px 0 0 20px', padding: '0' }}>
                    <li><strong>Pending Requests</strong> - Bookings awaiting admin approval (usually 1-3 business days)</li>
                    <li><strong>Approved Bookings</strong> - Confirmed bookings ready for use</li>
                    <li>Click on any card to view full details</li>
                    <li>You will receive email notifications for status updates</li>
                </ul>
            </div>

            <div style={styles.tabs}>
                <button
                    style={{
                        ...styles.tab,
                        ...(activeTab === 'pending' ? styles.activeTab : styles.inactiveTab)
                    }}
                    onClick={() => setActiveTab('pending')}
                >
                    Pending Requests
                    {pendingBookings.length > 0 && (
                        <span style={{ ...styles.badge, ...styles.pendingBadge }}>
                            {pendingBookings.length}
                        </span>
                    )}
                </button>
                <button
                    style={{
                        ...styles.tab,
                        ...(activeTab === 'approved' ? styles.activeTab : styles.inactiveTab)
                    }}
                    onClick={() => setActiveTab('approved')}
                >
                    Approved Bookings
                    {approvedBookings.length > 0 && (
                        <span style={{ ...styles.badge, ...styles.approvedBadge }}>
                            {approvedBookings.length}
                        </span>
                    )}
                </button>
            </div>

            {isLoading ? (
                <div style={styles.loadingState}>
                    <div style={styles.emptyIcon}>⏳</div>
                    <div style={styles.emptyText}>Loading bookings...</div>
                </div>
            ) : currentBookings.length === 0 ? (
                <div style={styles.emptyState}>
                    <div style={styles.emptyIcon}>
                        {activeTab === 'pending' ? '📭' : '✅'}
                    </div>
                    <div style={styles.emptyText}>
                        {activeTab === 'pending' 
                            ? 'No pending booking requests'
                            : 'No approved bookings yet'}
                    </div>
                    <p>
                        {activeTab === 'pending' 
                            ? 'Create a new booking request to get started!'
                            : 'Your approved bookings will appear here.'}
                    </p>
                </div>
            ) : (
                <div style={styles.bookingGrid}>
                    {currentBookings.map((booking) => {
                        const statusInfo = getStatusInfo(booking.status);
                        
                        return (
                            <div 
                                key={booking.booking_id}
                                style={{
                                    ...styles.bookingCard,
                                    ...(booking.status === 'Pending' ? styles.pendingCard : styles.approvedCard),
                                    ...(hoveredCard === booking.booking_id && styles.hoveredCard)
                                }}
                                onClick={() => handleViewDetails(booking)}
                                onMouseEnter={() => setHoveredCard(booking.booking_id)}
                                onMouseLeave={() => setHoveredCard(null)}
                            >
                                <div style={styles.cardHeader}>
                                    <div style={styles.bookingId}>Booking #{booking.booking_id}</div>
                                    <div style={{ ...styles.statusBadge, ...statusInfo.style }}>
                                        {statusInfo.text}
                                    </div>
                                </div>
                                
                                <div style={styles.cardContent}>
                                    <div style={styles.detailRow}>
                                        <div style={styles.detailLabel}>Date</div>
                                        <div style={styles.detailValue}>
                                            {formatDate(booking.date)}
                                        </div>
                                    </div>
                                    <div style={styles.detailRow}>
                                        <div style={styles.detailLabel}>Venue</div>
                                        <div style={styles.detailValue}>{booking.venue_name}</div>
                                        <div style={{ fontSize: '12px', color: '#718096', marginTop: '2px' }}>
                                            {booking.venue_type} • Capacity: {booking.venue_capacity}
                                        </div>
                                    </div>
                                    <div style={styles.detailRow}>
                                        <div style={styles.detailLabel}>Time</div>
                                        <div style={styles.detailValue}>{booking.start_time} - {booking.end_time}</div>
                                    </div>
                                    {booking.event_name && (
                                        <div style={styles.detailRow}>
                                            <div style={styles.detailLabel}>Event</div>
                                            <div style={styles.detailValue}>{booking.event_name}</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {selectedBooking && (
                <div style={styles.modalOverlay} onClick={handleCloseDetails}>
                    <div style={styles.modalContainer} onClick={e => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <div style={styles.modalTitle}>Booking Details</div>
                            <button 
                                style={styles.closeButton}
                                onClick={handleCloseDetails}
                            >
                                ×
                            </button>
                        </div>

                        <div style={styles.detailSection}>
                            <div style={styles.sectionTitle}>
                                <span role="img" aria-label="info">📋</span> Basic Information
                            </div>
                            <div style={styles.infoGrid}>
                                <div style={styles.infoItem}>
                                    <div style={styles.infoLabel}>Booking ID</div>
                                    <div style={styles.infoValue}>#{selectedBooking.booking_id}</div>
                                </div>
                                <div style={styles.infoItem}>
                                    <div style={styles.infoLabel}>Status</div>
                                    <div style={styles.infoValue}>
                                        <span style={{ ...styles.statusBadge, ...getStatusInfo(selectedBooking.status).style }}>
                                            {getStatusInfo(selectedBooking.status).text}
                                        </span>
                                    </div>
                                </div>
                                <div style={styles.infoItem}>
                                    <div style={styles.infoLabel}>Submission Date</div>
                                    <div style={styles.infoValue}>
                                        {formatDate(selectedBooking.submission_date)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={styles.detailSection}>
                            <div style={styles.sectionTitle}>
                                <span role="img" aria-label="calendar">📅</span> Booking Details
                            </div>
                            <div style={styles.infoGrid}>
                                <div style={styles.infoItem}>
                                    <div style={styles.infoLabel}>Date</div>
                                    <div style={styles.infoValue}>{formatDetailedDate(selectedBooking.date)}</div>
                                </div>
                                <div style={styles.infoItem}>
                                    <div style={styles.infoLabel}>Venue</div>
                                    <div style={styles.infoValue}>
                                         {selectedBooking.venue_name} ({selectedBooking.venue_type})
                                    </div>
                                </div>
                                <div style={styles.infoItem}>
                                    <div style={styles.infoLabel}>Time Slot</div>
                                    <div style={styles.infoValue}>
                                        {selectedBooking.start_time} - {selectedBooking.end_time}
                                    </div>
                                </div>
                                <div style={styles.infoItem}>
                                    <div style={styles.infoLabel}>Capacity</div>
                                    <div style={styles.infoValue}>{selectedBooking.venue_capacity} people</div>
                                </div>
                            </div>
                        </div>

                        {selectedBooking.contact_name && (
                            <div style={styles.detailSection}>
                                <div style={styles.sectionTitle}>
                                    <span role="img" aria-label="user">👤</span> Contact Information
                                </div>
                                <div style={styles.infoGrid}>
                                    <div style={styles.infoItem}>
                                        <div style={styles.infoLabel}>Name</div>
                                        <div style={styles.infoValue}>{selectedBooking.contact_name}</div>
                                    </div>
                                    {selectedBooking.contact_gender && (
                                        <div style={styles.infoItem}>
                                            <div style={styles.infoLabel}>Gender</div>
                                            <div style={styles.infoValue}>
                                                {selectedBooking.contact_gender}
                                            </div>
                                        </div>
                                    )}
                                    {selectedBooking.organization && (
                                        <div style={styles.infoItem}>
                                            <div style={styles.infoLabel}>Organisation</div>
                                            <div style={styles.infoValue}>
                                                {selectedBooking.organisation}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {selectedBooking.event_name && (
                            <div style={styles.detailSection}>
                                <div style={styles.sectionTitle}>
                                    <span role="img" aria-label="event">🎯</span> Event Information
                                </div>
                                <div style={styles.infoGrid}>
                                    <div style={styles.infoItem}>
                                        <div style={styles.infoLabel}>Event Name</div>
                                        <div style={styles.infoValue}>{selectedBooking.event_name}</div>
                                    </div>
                                    {selectedBooking.estimated_participants && (
                                        <div style={styles.infoItem}>
                                            <div style={styles.infoLabel}>Estimated Participants</div>
                                            <div style={styles.infoValue}>{selectedBooking.estimated_participants} people</div>
                                        </div>
                                    )}
                                    {selectedBooking.booking_reason && (
                                        <div style={styles.infoItem}>
                                            <div style={styles.infoLabel}>Booking Reason</div>
                                            <div style={styles.infoValue}>{selectedBooking.booking_reason}</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div style={styles.detailSection}>
                            <div style={styles.sectionTitle}>
                                <span role="img" aria-label="description">📝</span> Detailed Description
                            </div>
                            <div style={styles.textBlock}>
                                {selectedBooking.description || 'No detailed description provided.'}
                            </div>
                        </div>

                        {selectedBooking.special_requirements && (
                            <div style={styles.detailSection}>
                                <div style={styles.sectionTitle}>
                                    <span role="img" aria-label="requirements">🔧</span> Special Requirements
                                </div>
                                <div style={styles.textBlock}>
                                    {selectedBooking.special_requirements}
                                </div>
                            </div>
                        )}

                        <div style={styles.detailSection}>
                            <div style={styles.sectionTitle}>
                                <span role="img" aria-label="system">⚙️</span> System Information
                            </div>
                            <div style={styles.infoGrid}>
                                <div style={styles.infoItem}>
                                    <div style={styles.infoLabel}>User ID</div>
                                    <div style={styles.infoValue}>{selectedBooking.user_id || user.User_ID}</div>
                                </div>
                                <div style={styles.infoItem}>
                                    <div style={styles.infoLabel}>Venue ID</div>
                                    <div style={styles.infoValue}>{selectedBooking.venue_id}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MyBooking;