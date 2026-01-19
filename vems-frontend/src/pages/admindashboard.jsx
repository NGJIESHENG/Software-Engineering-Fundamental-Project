import React,{ useState, useEffect } from "react";
import axios from "axios";

function AdminDashboard(){
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const fetchBookings = async () => {
            try{
                const response = await axios.get("http://127.0.0.1:5000/api/admin/all-bookings");
                setBookings(response.data);
            }catch (error){
                console.error("Error fetching bookings:", error);
            }
        };
        fetchBookings();
    },[]);

    const handleDecision = async (bookingId, decision) => {
        try{
            await axios.post("http://127.0.0.1:5000/api/admin/decide-booking",{
                booking_id: bookingId,
                decision: decision
            });

            setBookings(bookings.filter(b => b.id !== bookingId));
            alert(`Booking ${decison}!`);
        } catch (error){
            alert("Error upload booking.");
        }
    };

    return(
        <div>
            <h2>Admin Approval Portal</h2>
            <table>
                <thead>
                    <tr>
                        <th>User ID</th>
                        <th>Venue ID</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map((b) => (
                        <tr key={b.id}>
                            <td>{b.user}</td>
                            <td>{b.venue}</td>
                            <td>{b.date}</td>
                            <td>
                                <button onClick={() => handleDecision(b.id, 'Approved')}>Approve</button>
                                <button onClick={() => handleDecision(b.id, 'Rejected')}>Reject</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminDashboard;