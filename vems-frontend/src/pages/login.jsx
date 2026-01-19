import React from 'react';
import {useState} from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage(){
    const [User_ID, setUser_ID] = useState('');
    const [Password,setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e)=> {
        e.preventDefault();
        alert(`Login Attempt \nUser ID: ${User_ID}\nStatus: Authenticating...`);
        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({User_ID, Password}),  
            });

            const data = await response.json();
            
                console.log("Full Data Object:", data); 

            if (response.ok) {
                const userData = {
                    Name: data.user.Name,
                    User_ID: data.user.User_ID,
                    Email: data.user.Email,
                    Phone: data.user.Phone,
                    Role: data.user.Role,
                };
                localStorage.setItem('currentUser', JSON.stringify(userData));
                localStorage.setItem('token', response.data.token);
                alert(`Logged into ${User_ID}!`);
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
                        value={User_ID}
                        onChange={(e) => setUser_ID(e.target.value)}
                        required/>

                    <label style={{ fontWeight: 'bold'}}>Password</label>
                    < input
                        style={inputStyle}
                        type="Password"
                        placeholder="Enter Password"
                        value={Password}
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