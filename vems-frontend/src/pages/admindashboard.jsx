import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('pending'); // pending, schedule, users, reports, logs

    // --- STATE VARIABLES ---
    const [bookings, setBookings] = useState([]); // Pending approvals
    const [scheduleEvents, setScheduleEvents] = useState([]); // All events
    const [users, setUsers] = useState([]);
    const [reports, setReports] = useState(null);
    const [logs, setLogs] = useState([]);
    
    // Log Filters
    const [logFilters, setLogFilters] = useState({ admin_id: '', action_type: '', date: '' });
    
    // Modal State
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({});
    
    // User Edit State
    const [editingUser, setEditingUser] = useState(null);
    const [userForm, setUserForm] = useState({});

    useEffect(() => {
        // Initial Fetch based on section
        if (activeSection === 'pending') fetchPendingBookings();
        if (activeSection === 'schedule') fetchMasterSchedule();
        if (activeSection === 'users') fetchUsers();
        if (activeSection === 'reports') fetchReports();
        if (activeSection === 'logs') fetchLogs();
    }, [activeSection]);

    // --- API CALLS ---
    const getToken = () => localStorage.getItem('token');
    const getHeaders = () => ({ headers: { 'Authorization': `Bearer ${getToken()}` } });

    const fetchPendingBookings = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/admin/all-bookings", getHeaders());
            setBookings(res.data);
        } catch (err) { console.error(err); }
    };

    const fetchMasterSchedule = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/admin/master-schedule", getHeaders());
            setScheduleEvents(res.data);
        } catch (err) { console.error(err); }
    };

    const fetchUsers = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/admin/users", getHeaders());
            setUsers(res.data);
        } catch (err) { console.error(err); }
    };

    const fetchReports = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/admin/reports", getHeaders());
            setReports(res.data);
        } catch (err) { console.error(err); }
    };

    const fetchLogs = async () => {
        try {
            const params = new URLSearchParams(logFilters).toString();
            const res = await axios.get(`http://localhost:5000/api/admin/logs?${params}`, getHeaders());
            setLogs(res.data);
        } catch (err) { console.error(err); }
    };

    // --- HANDLERS: PENDING APPROVALS ---
    const handleDecision = async (bookingId, decision) => {
        let reason = "";
        if (decision === 'Rejected') {
            reason = window.prompt("Reason for rejection:");
            if (!reason) return;
        }
        try {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            await axios.post("http://localhost:5000/api/admin/decide-booking", {
                booking_id: bookingId, decision, admin_id: currentUser?.User_ID, reason
            }, getHeaders());
            fetchPendingBookings();
            alert(`Booking ${decision}!`);
        } catch (err) { alert("Error processing request"); }
    };

    // --- HANDLERS: SCHEDULE ---
    const handleEventClick = (event) => {
        setSelectedEvent(event);
        setEditForm({ 
            booking_id: event.booking_id, 
            event_name: event.event_name, 
            description: event.description || '', 
            participants: event.participants || 0 
        });
        setIsEditing(false);
    };

    const handleCancelEvent = async () => {
        const reason = window.prompt("Reason for cancellation (will mark as Rejected):");
        if (!reason) return;
        try {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            await axios.post("http://localhost:5000/api/admin/decide-booking", {
                booking_id: selectedEvent.booking_id, decision: 'Rejected', admin_id: currentUser?.User_ID, reason
            }, getHeaders());
            setSelectedEvent(null);
            fetchMasterSchedule();
            alert("Event cancelled.");
        } catch (err) { alert("Error cancelling event"); }
    };

    const handleUpdateEvent = async (e) => {
        e.preventDefault();
        try {
            await axios.put("http://localhost:5000/api/update-booking", editForm, getHeaders());
            alert("Event updated!");
            setSelectedEvent(null);
            fetchMasterSchedule();
        } catch (err) { alert("Update failed"); }
    };

    // --- HANDLERS: USERS ---
    const handleDeleteUser = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            await axios.delete(`http://localhost:5000/api/admin/user/${userId}`, getHeaders());
            fetchUsers();
        } catch (err) { alert("Failed to delete user"); }
    };

    const handleResetPassword = async (userId) => {
        const newPass = window.prompt("Enter new password:");
        if (!newPass) return;
        try {
            await axios.post(`http://localhost:5000/api/admin/user/${userId}/reset-password`, { new_password: newPass }, getHeaders());
            alert("Password reset successfully");
        } catch (err) { alert("Failed to reset password"); }
    };

    const handleEditUserClick = (user) => {
        setEditingUser(user);
        setUserForm({ ...user });
    };

    const submitUserUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/api/admin/user/${editingUser.User_ID}`, userForm, getHeaders());
            setEditingUser(null);
            fetchUsers();
            alert("User updated");
        } catch (err) { alert("Update failed"); }
    };

    // --- STYLES ---
    const s = {
        container: { padding: '30px', fontFamily: 'Arial, sans-serif', background: '#f8f9fa', minHeight: '100vh' },
        nav: { display: 'flex', gap: '10px', marginBottom: '30px', borderBottom: '2px solid #ddd', paddingBottom: '10px' },
        navBtn: (isActive) => ({
            padding: '10px 20px', border: 'none', background: isActive ? '#2b6cb0' : 'transparent',
            color: isActive ? 'white' : '#2b6cb0', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold'
        }),
        card: { background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', marginBottom: '20px' },
        table: { width: '100%', borderCollapse: 'collapse', marginTop: '10px' },
        th: { textAlign: 'left', padding: '12px', background: '#edf2f7', borderBottom: '2px solid #cbd5e0' },
        td: { padding: '12px', borderBottom: '1px solid #e2e8f0' },
        btn: { padding: '6px 12px', borderRadius: '4px', border: 'none', cursor: 'pointer', marginRight: '5px', color: 'white' },
        modal: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' },
        modalContent: { background: 'white', padding: '30px', borderRadius: '10px', width: '500px', maxWidth: '90%' },
        input: { width: '100%', padding: '8px', margin: '5px 0 15px', border: '1px solid #ddd', borderRadius: '4px' },
        barContainer: { display: 'flex', alignItems: 'flex-end', height: '200px', gap: '10px', borderBottom: '2px solid #ccc', paddingBottom: '5px' },
        bar: (height, color) => ({ width: '50px', height: `${height}%`, background: color, transition: 'height 0.3s' }),
        statCard: { flex: 1, padding: '20px', background: 'white', textAlign: 'center', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }
    };

    // --- RENDER SECTIONS ---

    const renderPending = () => (
        <div style={s.card}>
            <h3>Pending Approvals</h3>
            <table style={s.table}>
                <thead><tr><th style={s.th}>User</th><th style={s.th}>Event</th><th style={s.th}>Venue</th><th style={s.th}>Date</th><th style={s.th}>Action</th></tr></thead>
                <tbody>
                    {bookings.length === 0 ? <tr><td colSpan="5" style={{padding:'20px', textAlign:'center'}}>No pending bookings.</td></tr> :
                    bookings.map(b => (
                        <tr key={b.id}>
                            <td style={s.td}>{b.user_name}</td>
                            <td style={s.td}>{b.event_name}</td>
                            <td style={s.td}>{b.venue_name}</td>
                            <td style={s.td}>{b.date}</td>
                            <td style={s.td}>
                                <button onClick={() => handleDecision(b.id, 'Approved')} style={{...s.btn, background: '#38a169'}}>Approve</button>
                                <button onClick={() => handleDecision(b.id, 'Rejected')} style={{...s.btn, background: '#e53e3e'}}>Reject</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const renderSchedule = () => (
        <div style={s.card}>
            <h3>Event Schedule Management</h3>
            <p style={{color:'#718096', fontSize:'14px'}}>Click on an event to manage details.</p>
            <table style={s.table}>
                <thead><tr><th style={s.th}>Date</th><th style={s.th}>Time</th><th style={s.th}>Event</th><th style={s.th}>Venue</th><th style={s.th}>Status</th><th style={s.th}>Action</th></tr></thead>
                <tbody>
                    {scheduleEvents.map(e => (
                        <tr key={e.booking_id}>
                            <td style={s.td}>{e.date}</td>
                            <td style={s.td}>{e.start_time} - {e.end_time}</td>
                            <td style={s.td}><strong>{e.event_name}</strong><br/><small>{e.user_name}</small></td>
                            <td style={s.td}>{e.venue_name}</td>
                            <td style={s.td}>
                                <span style={{
                                    padding:'4px 8px', borderRadius:'12px', fontSize:'12px',
                                    background: e.status==='Approved'?'#c6f6d5':e.status==='Rejected'?'#fed7d7':'#feebc8',
                                    color: e.status==='Approved'?'#22543d':e.status==='Rejected'?'#822727':'#744210'
                                }}>{e.status}</span>
                            </td>
                            <td style={s.td}>
                                <button onClick={() => handleEventClick(e)} style={{...s.btn, background: '#3182ce'}}>Details</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* EVENT MODAL */}
            {selectedEvent && (
                <div style={s.modal} onClick={() => setSelectedEvent(null)}>
                    <div style={s.modalContent} onClick={e => e.stopPropagation()}>
                        <div style={{display:'flex', justifyContent:'space-between'}}>
                            <h2>{isEditing ? 'Edit Event' : selectedEvent.event_name}</h2>
                            <button onClick={() => setSelectedEvent(null)} style={{background:'none', border:'none', fontSize:'20px', cursor:'pointer'}}>✖</button>
                        </div>
                        
                        {isEditing ? (
                            <form onSubmit={handleUpdateEvent}>
                                <label>Event Name</label>
                                <input style={s.input} value={editForm.event_name} onChange={e=>setEditForm({...editForm, event_name: e.target.value})} />
                                <label>Description</label>
                                <input style={s.input} value={editForm.description} onChange={e=>setEditForm({...editForm, description: e.target.value})} />
                                <label>Participants</label>
                                <input style={s.input} type="number" value={editForm.participants} onChange={e=>setEditForm({...editForm, participants: e.target.value})} />
                                <div style={{textAlign:'right'}}>
                                    <button type="button" onClick={() => setIsEditing(false)} style={{marginRight:'10px', padding:'8px 16px', cursor:'pointer'}}>Cancel</button>
                                    <button type="submit" style={{padding:'8px 16px', background:'#3182ce', color:'white', border:'none', borderRadius:'4px', cursor:'pointer'}}>Save Changes</button>
                                </div>
                            </form>
                        ) : (
                            <div>
                                <p><strong>Status:</strong> {selectedEvent.status}</p>
                                <p><strong>Organizer:</strong> {selectedEvent.user_name}</p>
                                <p><strong>Venue:</strong> {selectedEvent.venue_name}</p>
                                <p><strong>Time:</strong> {selectedEvent.date} ({selectedEvent.start_time} - {selectedEvent.end_time})</p>
                                <p><strong>Description:</strong> {selectedEvent.description || 'N/A'}</p>
                                <div style={{marginTop:'20px', display:'flex', gap:'10px'}}>
                                    <button onClick={() => setIsEditing(true)} style={{...s.btn, background: '#d69e2e'}}>Edit Details</button>
                                    <button onClick={handleCancelEvent} style={{...s.btn, background: '#e53e3e'}}>Cancel Event</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );

    const renderUsers = () => (
        <div style={s.card}>
            <h3>User Accounts</h3>
            <table style={s.table}>
                <thead><tr><th style={s.th}>ID</th><th style={s.th}>Name</th><th style={s.th}>Email</th><th style={s.th}>Role</th><th style={s.th}>Actions</th></tr></thead>
                <tbody>
                    {users.map(u => (
                        <tr key={u.User_ID}>
                            <td style={s.td}>{u.User_ID}</td>
                            <td style={s.td}>{u.Name}</td>
                            <td style={s.td}>{u.Email}</td>
                            <td style={s.td}>{u.Role}</td>
                            <td style={s.td}>
                                <button onClick={() => handleEditUserClick(u)} style={{...s.btn, background: '#3182ce'}}>Edit</button>
                                <button onClick={() => handleResetPassword(u.User_ID)} style={{...s.btn, background: '#d69e2e'}}>Reset Pwd</button>
                                <button onClick={() => handleDeleteUser(u.User_ID)} style={{...s.btn, background: '#e53e3e'}}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* USER EDIT MODAL */}
            {editingUser && (
                <div style={s.modal} onClick={() => setEditingUser(null)}>
                    <div style={s.modalContent} onClick={e => e.stopPropagation()}>
                        <h3>Edit User: {editingUser.User_ID}</h3>
                        <form onSubmit={submitUserUpdate}>
                            <label>Name</label>
                            <input style={s.input} value={userForm.Name} onChange={e=>setUserForm({...userForm, Name: e.target.value})} />
                            <label>Email</label>
                            <input style={s.input} value={userForm.Email} onChange={e=>setUserForm({...userForm, Email: e.target.value})} />
                            <label>Role</label>
                            <select style={s.input} value={userForm.Role} onChange={e=>setUserForm({...userForm, Role: e.target.value})}>
                                <option value="Student">Student</option>
                                <option value="Staff">Staff</option>
                                <option value="Admin">Admin</option>
                            </select>
                            <div style={{textAlign:'right'}}>
                                <button type="button" onClick={()=>setEditingUser(null)} style={{marginRight:'10px', padding:'8px'}}>Cancel</button>
                                <button type="submit" style={{padding:'8px 16px', background:'#3182ce', color:'white', border:'none'}}>Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );

    const renderReports = () => {
        if (!reports) return <p>Loading reports...</p>;
        // Helper to find max for simple scaling
        const maxVenue = Math.max(...reports.top_venues.map(v => v.value), 1);
        const maxStatus = Math.max(...reports.statuses.map(v => v.value), 1);

        return (
            <div>
                {/* KPI CARDS */}
                <div style={{display:'flex', gap:'20px', marginBottom:'30px'}}>
                    <div style={s.statCard}>
                        <h4 style={{margin:0, color:'#718096'}}>Total Users</h4>
                        <h2 style={{fontSize:'36px', color:'#2b6cb0', margin:'10px 0'}}>{reports.total_users}</h2>
                    </div>
                    <div style={{...s.statCard, flex: 1, padding: '20px', background: 'white', textAlign: 'center', borderRadius: '8px'}}>
                        <h4 style={{margin:0, color:'#718096'}}>Role Distribution</h4>
                        <div style={{marginTop:'10px'}}>
                            {reports.roles.map(r => <span key={r.name} style={{display:'block', fontSize:'14px'}}><b>{r.name}:</b> {r.value}</span>)}
                        </div>
                    </div>
                </div>

                {/* GRAPHS */}
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px'}}>
                    <div style={s.card}>
                        <h4>Booking Status Distribution</h4>
                        <div style={s.barContainer}>
                            {reports.statuses.map(st => (
                                <div key={st.name} style={{textAlign:'center', flex:1}}>
                                    <div style={s.bar((st.value/maxStatus)*100, st.name==='Approved'?'#48bb78':st.name==='Rejected'?'#f56565':'#ed8936')}></div>
                                    <div style={{marginTop:'5px', fontSize:'12px'}}>{st.name} ({st.value})</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={s.card}>
                        <h4>Top 5 Popular Venues</h4>
                        <div style={s.barContainer}>
                            {reports.top_venues.map(v => (
                                <div key={v.name} style={{textAlign:'center', flex:1}}>
                                    <div style={s.bar((v.value/maxVenue)*100, '#4299e1')}></div>
                                    <div style={{marginTop:'5px', fontSize:'12px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', width:'50px'}} title={v.name}>{v.name}</div>
                                    <div style={{fontSize:'10px', fontWeight:'bold'}}>{v.value}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderLogs = () => (
        <div style={s.card}>
            <h3>Log History</h3>
            <div style={{display:'flex', gap:'40px', marginBottom:'20px', alignItems:'end', flexWrap: 'wrap'}}>
                
                <div style={{width: '200px'}}>
                    <label style={{fontSize:'12px', fontWeight:'bold', display:'block', marginBottom:'5px'}}>Admin ID</label>
                    <input 
                        style={{...s.input, margin:0}} 
                        value={logFilters.admin_id} 
                        onChange={e=>setLogFilters({...logFilters, admin_id: e.target.value})} 
                        placeholder="Filter Admin ID" 
                    />
                </div>

                <div style={{width: '150px'}}>
                    <label style={{fontSize:'12px', fontWeight:'bold', display:'block', marginBottom:'5px'}}>Action Type</label>
                    <select 
                        style={{...s.input, margin:0}} 
                        value={logFilters.action_type} 
                        onChange={e=>setLogFilters({...logFilters, action_type: e.target.value})}
                    >
                        <option value="">All</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>

                <div style={{width: '180px'}}>
                    <label style={{fontSize:'12px', fontWeight:'bold', display:'block', marginBottom:'5px'}}>Date</label>
                    <input 
                        type="date" 
                        style={{...s.input, margin:0}} 
                        value={logFilters.date} 
                        onChange={e=>setLogFilters({...logFilters, date: e.target.value})} 
                    />
                </div>

                <button 
                    onClick={fetchLogs} 
                    style={{...s.btn, background:'#2b6cb0', height:'36px', padding: '0 25px'}}
                >
                    Filter
                </button>
            </div>

            <table style={s.table}>
                <thead>
                    <tr>
                        <th style={s.th}>Time</th>
                        <th style={s.th}>Admin</th>
                        <th style={s.th}>Action</th>
                        <th style={s.th}>Booking ID</th>
                        <th style={s.th}>Changes</th>
                        <th style={s.th}>Reason</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.length === 0 ? 
                        <tr><td colSpan="6" style={{textAlign:'center', padding:'20px', color: '#718096'}}>System shows no records</td></tr> :
                        logs.map(log => (
                        <tr key={log.Log_ID}>
                            <td style={s.td}>{log.Action_Time}</td>
                            <td style={s.td}>{log.Admin_ID}</td>
                            <td style={s.td}>
                                <span style={{
                                    fontWeight:'bold', 
                                    color: log.Action_Type==='Approved'?'green':log.Action_Type==='Rejected'?'red':'black'
                                }}>
                                    {log.Action_Type}
                                </span>
                            </td>
                            <td style={s.td}>{log.Booking_ID}</td>
                            <td style={s.td}>{log.Old_Status} → {log.New_Status}</td>
                            <td style={s.td}>{log.Reason || '-'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    return (
        <div style={s.container}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
                <h1 style={{color:'#2c5282', margin:0}}>Admin Dashboard</h1>
                <button onClick={() => { localStorage.clear(); navigate('/login'); }} style={{background:'#e53e3e', color:'white', border:'none', padding:'8px 16px', borderRadius:'4px', cursor:'pointer'}}>Logout</button>
            </div>
            
            {/* NAVIGATION */}
            <div style={s.nav}>
                <button onClick={() => setActiveSection('pending')} style={s.navBtn(activeSection === 'pending')}>Pending Approvals</button>
                <button onClick={() => setActiveSection('schedule')} style={s.navBtn(activeSection === 'schedule')}>Event Schedule</button>
                <button onClick={() => setActiveSection('users')} style={s.navBtn(activeSection === 'users')}>User Accounts</button>
                <button onClick={() => setActiveSection('reports')} style={s.navBtn(activeSection === 'reports')}>System Usage</button>
                <button onClick={() => setActiveSection('logs')} style={s.navBtn(activeSection === 'logs')}>Log History</button>
            </div>

            {/* CONTENT AREA */}
            {activeSection === 'pending' && renderPending()}
            {activeSection === 'schedule' && renderSchedule()}
            {activeSection === 'users' && renderUsers()}
            {activeSection === 'reports' && renderReports()}
            {activeSection === 'logs' && renderLogs()}
        </div>
    );
}

export default AdminDashboard;