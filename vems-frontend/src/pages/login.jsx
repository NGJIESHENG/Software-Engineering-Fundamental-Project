import React from 'react';
import {useState} from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage(){
    const [userId, setUserId] = useState('');
    const [password,setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e)=> {
        e.preventDefault();
        alert(`Login Attempt \nUser ID: ${userId}\nStatus: Authenticating...`);
        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({userId, password}),
            });

            const data = await response.json();

            if (response.ok) {
                const userData = {
                    username: data.name,
                    user_ID: data.userId,
                    email: data.email,
                    phone: data.phone,
                    role: data.role,
                };
                localStorage.setItem('userData', JSON.stringify(userData));
                alert(`Logged into ${userId}!`);
                navigate('/homepage');
            } else {
                alert(`Login failed: ${data.message}`);
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
        width: '100%',
        background: 'linear-gradient(135deg, #2419F0, #6F58FF)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '720px',
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
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        required/>

                    <label style={{ fontWeight: 'bold'}}>Password</label>
                    < input
                        style={inputStyle}
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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