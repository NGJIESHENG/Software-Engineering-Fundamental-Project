import React, { useState, useEffect } from "react";
import axios from "axios";

function AdminDashboard() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                // Ensure the URL matches your Flask port
                const response = await axios.get("http://localhost:5000/api/admin/all-bookings");
                // Safety: Always ensure we have an array
                setBookings(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.error("Error fetching bookings:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    const handleDecision = async (bookingId, decision) => {
        try {
            // FIX: Use optional chaining to prevent crash if currentUser is null
            const userString = localStorage.getItem('currentUser');
            const currentUser = userString ? JSON.parse(userString) : null;
            const adminId = currentUser?.User_ID || 'admin01';

            await axios.post("http://localhost:5000/api/admin/decide-booking", {
                booking_id: bookingId,
                decision: decision,
                admin_id: adminId
            });

            setBookings(prev => prev.filter(b => b.id !== bookingId));
            alert(`Booking ${decision} successfully!`);
        } catch (error) {
            console.error("Decision Error:", error);
            alert("Error updating booking status.");
        }
    };

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading Admin Portal...</div>;

    return (
        <div style={{ padding: '40px', fontFamily: 'Arial' }}>
            <h2 style={{ borderBottom: '2px solid #2b6cb0', paddingBottom: '10px' }}>Admin Approval Portal</h2>
            
            {bookings.length === 0 ? (
                <p style={{ textAlign: 'center', marginTop: '20px', color: '#718096' }}>No pending bookings found.</p>
            ) : (
                <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', background: '#f7fafc' }}>
                            <th style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>User</th>
                            <th style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>Venue</th>
                            <th style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>Date</th>
                            <th style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map((b) => (
                            <tr key={b.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                <td style={{ padding: '12px' }}>{b.user_name || "Unknown"}</td>
                                <td style={{ padding: '12px' }}>{b.venue_name || "Unknown"}</td>
                                <td style={{ padding: '12px' }}>{b.date}</td>
                                <td style={{ padding: '12px' }}>
                                    <button 
                                        onClick={() => handleDecision(b.id, 'Approved')}
                                        style={{ marginRight: '10px', backgroundColor: '#38a169', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}
                                    >Approve</button>
                                    <button 
                                        onClick={() => handleDecision(b.id, 'Rejected')}
                                        style={{ backgroundColor: '#e53e3e', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}
                                    >Reject</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default AdminDashboard;