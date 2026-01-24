import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Notifications() {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [filter, setFilter] = useState('all'); 
    const styles = {
        container: {
            maxWidth: '900px',
            margin: '90px auto',
            padding: '30px',
            background: '#ffffff',
            borderRadius: '20px',
            boxShadow: '0 4px 20px rgb(223, 211, 240)',
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
        filterBar: {
            display: 'flex',
            gap: '10px',
            marginBottom: '25px',
            flexWrap: 'wrap'
        },
        filterButton: {
            padding: '10px 20px',
            border: '2px solid #e2e8f0',
            borderRadius: '8px',
            background: 'white',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.3s'
        },
        activeFilter: {
            background: '#2b6cb0',
            color: 'white',
            borderColor: '#2b6cb0'
        },
        notificationList: {
            display: 'flex',
            flexDirection: 'column',
            gap: '15px'
        },
        notificationCard: {
            background: '#f8fafc',
            borderRadius: '10px',
            padding: '20px',
            borderLeft: '4px solid',
            transition: 'all 0.3s',
            cursor: 'pointer'
        },
        approvalCard: {
            borderLeftColor: '#38a169',
            background: '#f0fff4'
        },
        rejectionCard: {
            borderLeftColor: '#e53e3e',
            background: '#fff5f5'
        },
        cardHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px'
        },
        eventName: {
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#2d3748',
            margin: 0
        },
        timestamp: {
            fontSize: '12px',
            color: '#718096'
        },
        statusBadge: {
            display: 'inline-block',
            padding: '4px 12px',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: 'bold',
            marginBottom: '10px'
        },
        approvedBadge: {
            background: '#c6f6d5',
            color: '#276749'
        },
        rejectedBadge: {
            background: '#fed7d7',
            color: '#c53030'
        },
        detailRow: {
            fontSize: '14px',
            color: '#4a5568',
            margin: '8px 0'
        },
        reasonBox: {
            marginTop: '12px',
            padding: '12px',
            background: '#fff5f5',
            borderRadius: '6px',
            borderLeft: '3px solid #e53e3e'
        },
        reasonTitle: {
            fontSize: '13px',
            fontWeight: 'bold',
            color: '#c53030',
            marginBottom: '5px'
        },
        reasonText: {
            fontSize: '14px',
            color: '#742a2a',
            margin: 0
        },
        emptyState: {
            textAlign: 'center',
            padding: '60px 20px',
            color: '#718096'
        },
        emptyIcon: {
            fontSize: '48px',
            marginBottom: '15px'
        },
        emptyText: {
            fontSize: '18px',
            fontWeight: '600',
            marginBottom: '8px'
        },
        backButton: {
            padding: '12px 30px',
            background: '#718096',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'background 0.3s',
            marginTop: '20px',
            width: 'fit-content'
        },
        backgroundstyle : {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #c1e2ff, #d6f2ff)',
        padding: '40px 20px',
        fontFamily: 'Arial, sans-serif'
        }
    };
    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            navigate('/login');
            return;
        }
        setUser(currentUser);
    }, [navigate]);
    useEffect(() => {
        if (user) {
            fetchNotifications();
        }
    }, [user]);
    const fetchNotifications = async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token')?.replace(/"/g, '');
            const response = await axios.get(
                `http://localhost:5000/api/notifications/${user.User_ID}`,
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );
            if (response.data && response.data.notifications) {
                setNotifications(response.data.notifications);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setIsLoading(false);
        }
    };
    const formatTimestamp = (timestamp) => {
        if (!timestamp) return 'Recently';
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        return date.toLocaleDateString('en-GB', { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric' 
        });
    };
    const filteredNotifications = notifications.filter(notif => {
        if (filter === 'all') return true;
        return notif.type === filter;
    });
    const handleNotificationClick = (notification) => {
        navigate('/my-booking', {
            state: { highlightBookingId: notification.booking_id }
        });
    };
    if (!user) return null;
    return (
    <div style={styles.backgroundstyle}>
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>Notifications</h1>
                <p style={styles.subtitle}>Stay updated on your booking requests</p>
            </div>
            <div style={styles.filterBar}>
                <button
                    style={{
                        ...styles.filterButton,
                        ...(filter === 'all' ? styles.activeFilter : {})
                    }}
                    onClick={() => setFilter('all')}>
                    All ({notifications.length})
                </button>
                <button
                    style={{...styles.filterButton,...(filter === 'approval' ? styles.activeFilter : {})}}onClick={() => setFilter('approval')}>
                        ✅ Approved ({notifications.filter(n => n.type === 'approval').length})
                </button>
                <button style={{...styles.filterButton,...(filter === 'rejection' ? styles.activeFilter : {})}}onClick={() => setFilter('rejection')}>
                        ❌ Rejected ({notifications.filter(n => n.type === 'rejection').length})
                </button>
            </div>
            {isLoading ? (
                <div style={styles.emptyState}>
                    <p>Loading notifications...</p>
                </div>
            ) : filteredNotifications.length === 0 ? (
                <div style={styles.emptyState}>
                    <div style={styles.emptyIcon}>📭</div>
                    <p style={styles.emptyText}>No notifications yet</p>
                    <p>You'll be notified when your booking requests are reviewed</p>
                    <button style={styles.backButton}onClick={() => navigate('/homepage')}>← Back to Home
                    </button>
                </div>
            ) : (
                <div style={styles.notificationList}>
                    {filteredNotifications.map((notif) => (
                        <div
                            key={`${notif.booking_id}-${notif.action_time}`}
                            style={{...styles.notificationCard,...(notif.type === 'approval' ? styles.approvalCard : styles.rejectionCard)}}onClick={() => handleNotificationClick(notif)}>
                            <div style={styles.cardHeader}>
                                <h3 style={styles.eventName}>{notif.event_name}</h3>
                                <span style={styles.timestamp}>
                                    {formatTimestamp(notif.action_time)}
                                </span>
                            </div>
                            <span
                                style={{...styles.statusBadge,...(notif.type === 'approval' ? styles.approvedBadge : styles.rejectedBadge)}}>
                                {notif.status}
                            </span>
                            <div style={styles.detailRow}>
                                📍 <strong>Venue:</strong> {notif.venue_name}
                            </div>
                            <div style={styles.detailRow}>
                                📅 <strong>Date:</strong> {notif.date}
                            </div>
                            <div style={styles.detailRow}>
                                🕐 <strong>Time:</strong> {notif.start_time} - {notif.end_time}
                            </div>
                            {notif.type === 'rejection' && notif.reason && (
                                <div style={styles.reasonBox}>
                                    <div style={styles.reasonTitle}>Rejection Reason:</div>
                                    <p style={styles.reasonText}>{notif.reason}</p>
                                </div>
                            )}
                        </div>
                    ))}
                    <button style={styles.backButton}onClick={() => navigate('/homepage')}>← Back to Home</button>
                </div>
            )}
        </div>
    </div>
    );
}

export default Notifications;