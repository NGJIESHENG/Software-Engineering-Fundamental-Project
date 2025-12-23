import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        userId: '',
        role: 'Student'
    });

    const handleRegister = (e) => {
        e.preventDefault();
        alert(`Account Created for ${formData.name}! Role: ${formData.role}`);
        navigate('/Login');
    };

    const inputStyle = {
        width: '100%',
        padding: '10px',
        margin: '10px 0',
        borderRadius: '4px',
        border: '1px solid #ccc'
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', fontFamily: 'Arial' }}>
            <h1 style={{ textAlign: 'center', color: '#2b6cb0' }}>VEMS Register</h1>
            <form onSubmit={handleRegister}>
                <label>Full Name</label>
                <input style={inputStyle} type="text" placeholder="Enter Name" onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                
                <label>User ID</label>
                <input style={inputStyle} type="text" placeholder="e.g. 243UC247D5" onChange={(e) => setFormData({...formData, userId: e.target.value})} required />

                <label>Email</label>
                <input style={inputStyle} type="email" placeholder="mmu@email.com" onChange={(e) => setFormData({...formData, email: e.target.value})} required />

                <label>User Role</label>
                <select style={inputStyle} onChange={(e) => setFormData({...formData, role: e.target.value})}>
                    <option value="Student">Student</option>
                    <option value="Lecturer">Lecturer</option>
                    <option value="Event Organizer">Event Organizer</option>
                </select>

                <button type="submit" style={{ width: '100%', padding: '12px', background: '#3182ce', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Register Account
                </button>
            </form>
        </div>
    );
}

export default RegisterPage;