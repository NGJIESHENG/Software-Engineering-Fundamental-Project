import React, { useState, useEffect } from "react";
import axios from "axios";

function AdminDashboard() {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/admin/all-bookings");
                setBookings(response.data);
            } catch (error) {
                console.error("Error fetching bookings:", error);
            }
        };
        fetchBookings();
    }, []);

    const handleDecision = async (bookingId, decision) => {
        try {
            await axios.post("http://localhost:5000/api/admin/decide-booking", {
                booking_id: bookingId,
                decision: decision,
                admin_id: JSON.parse(localStorage.getItem('currentUser')).User_ID
            });

           
            setBookings(bookings.filter(b => b.id !== bookingId));
            alert(`Booking ${decision} successfully!`);
        } catch (error) {
            console.error("Decision Error:", error);
            alert("Error updating booking.");
        }
    };

    return (
        <div style={{ padding: '40px', fontFamily: 'Arial' }}>
            <h2 style={{ borderBottom: '2px solid #2b6cb0', paddingBottom: '10px' }}>Admin Approval Portal</h2>
            <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ textAlign: 'left', background: '#f7fafc' }}>
                        <th style={{ padding: '12px' }}>User Name</th>
                        <th style={{ padding: '12px' }}>Venue Name</th>
                        <th style={{ padding: '12px' }}>Date</th>
                        <th style={{ padding: '12px' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map((b) => (
                        <tr key={b.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                            {/* Fixed the keys below to match backend output */}
                            <td style={{ padding: '12px' }}>{b.user_name}</td>
                            <td style={{ padding: '12px' }}>{b.venue_name}</td>
                            <td style={{ padding: '12px' }}>{b.date}</td>
                            <td style={{ padding: '12px' }}>
                                <button 
                                    onClick={() => handleDecision(b.id, 'Approved')}
                                    style={{ marginRight: '10px', backgroundColor: '#38a169', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                                >
                                    Approve
                                </button>
                                <button 
                                    onClick={() => handleDecision(b.id, 'Rejected')}
                                    style={{ backgroundColor: '#e53e3e', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                                >
                                    Reject
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {bookings.length === 0 && <p style={{ textAlign: 'center', marginTop: '20px', color: '#718096' }}>No pending bookings found.</p>}
        </div>
    );
}

export default AdminDashboard;