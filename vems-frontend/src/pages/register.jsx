import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        userId: '',
        password: '',
        role: 'Student'
    });

    const handleRegister = async (e) => { 
        e.preventDefault();
        
        try {
            const response = await fetch('http://localhost:5000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                alert(`Account created for ${formData.name}!`);
                navigate('/login');
            } else {
                alert(`Registration failed: ${data.message}`);
            }
        } catch (error) {
            console.error("Connection error:", error);
            alert("Could not connect to the server. Make sure your Flask app is running!");
        }
    };

    const inputStyle = {
        width: '95%',
        padding: '10px',
        margin: '10px 0',
        borderRadius: '4px',
        border: '1px solid #ccc'
    };
    const backgroundstyle = {
        width: '100%',
        background: 'linear-gradient(135deg, #2419F0, #6F58FF)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '720px',
    };

    return (
        <div style={backgroundstyle}>
            <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', fontFamily: 'Arial' , backgroundColor: 'white' }}>
                <h1 style={{ textAlign: 'center', color: '#2b6cb0' }}>VEMS Register</h1>
                <form onSubmit={handleRegister}>
                    <label>Full Name</label>
                    <input style={inputStyle} type="text" placeholder="Enter Name" onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                    
                    <label>User ID</label>
                    <input style={inputStyle} type="text" placeholder="e.g. 243UC247D5" onChange={(e) => setFormData({...formData, userId: e.target.value})} required />

                    <label>Email</label>
                    <input style={inputStyle} type="email" placeholder="mmu@email.com" onChange={(e) => setFormData({...formData, email: e.target.value})} required />

                    <label>Password</label>
                    <input style={inputStyle} type="password" placeholder="Enter password" onChange={(e) => setFormData({...formData, password: e.target.value})}required />

                    <label>User Role</label>
                    <select style={{...inputStyle, width:'100%'}} onChange={(e) => setFormData({...formData, role: e.target.value})}>
                        <option value="Student">Student</option>
                        <option value="Lecturer">Lecturer</option>
                        <option value="Event Organizer">Event Organizer</option>
                    </select>
                    <p style={{ textAlign: 'center', fontSize: '14px', marginTop: '15px'}}>
                        Already have account ? <a href="/login" style={{ color:'#2b6cb0'}}>Click here</a>
                    </p>
                    <button type="submit" style={{ width: '100%', padding: '12px', background: '#3182ce', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                        Register Account
                    </button>
                </form>
            </div>
        </div>
    );
}

export default RegisterPage;