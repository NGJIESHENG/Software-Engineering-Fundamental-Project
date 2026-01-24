import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
    const navigate = useNavigate();
    
    // FIX: Initialize with empty strings to prevent uncontrolled->controlled warning
    const [formData, setFormData] = useState({
        User_ID: '',
        Password: ''
    });
    const [loading, setLoading] = useState(false);
    const handleLogin = async (e) => {
        e.preventDefault();
        alert(`Login Attempt \nUser ID: ${formData.User_ID}\nStatus: Authenticating...`);
        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (response.ok) {
                // Store minimal data in localStorage
                localStorage.setItem('token', data.token);
                localStorage.setItem('user_id', data.user.User_ID);
                localStorage.setItem('currentUser', JSON.stringify(data.user));
                console.log('Login successful for:', data.user.User_ID);
                alert(`Welcome, ${data.user.Name}!`);
                const role = data.user.Role.toLowerCase().trim();
                if (role === 'admin') {
                    navigate('/admin-dashboard');
                } else {
                    navigate('/homepage');
                }
            } else {
                alert(data.message || 'Login failed');
            }
        } catch (error) {
            console.error("Connection error:", error);
            alert("Could not connect to the server.");
        }
    };

    const containerStyle = {
        maxWidth: '400px',
        margin: '100px auto',
        padding: '20px',
        background: '#f7fafc',
        border: '1px solid #ddd',
        borderRadius: '8px',
        fontFamily: 'Arial',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    };

    const inputStyle = {
        width: '100%',
        padding: '10px',
        margin: '10px 0',
        borderRadius: '4px',
        border: '1px solid #ccc',
        boxSizing: 'border-box'
    };

    const buttonStyle = {
        width:'100%',
        padding: '12px',
        background: '#38a169',
        color: 'white',
        border:'none',
        borderRadius:'4px',
        cursor: 'pointer',
        fontWeight: 'bold',
        marginTop: '10px',
    };

    const backgroundstyle = {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #E8F5E9, #C8E6C9)',
        padding: '40px 20px',
        fontFamily: 'Arial, sans-serif'
    };

    return (
        <div style={backgroundstyle}>
            <div style={containerStyle}>
                <h1 style={{ textAlign: 'center', color: '#2f855a'}}>VEMS Login</h1>
                <form onSubmit={handleLogin}>
                    <label style={{ fontWeight: 'bold '}}>User ID</label>
                    <input 
                        style={inputStyle} 
                        type="text" 
                        placeholder="Enter your ID (e.g. 243UC247D5)"
                        value={formData.User_ID}
                        onChange={(e) => setFormData({...formData, User_ID: e.target.value})} 
                        required/>

                    <label style={{ fontWeight: 'bold'}}>Password</label>
                    <input 
                        style={inputStyle} 
                        type="password" 
                        placeholder="Enter password" 
                        value={formData.Password}
                        onChange={(e) => setFormData({...formData, Password: e.target.value})} 
                        required/>

                    <button type="submit" style={buttonStyle}>
                        Sign In
                    </button>

                    <p style={{ textAlign: 'center', fontSize: '14px', marginTop: '15px'}}>
                        Don't have an account ? <a href="/register" style={{ color:'#2b6cb0'}}>Register here</a>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;