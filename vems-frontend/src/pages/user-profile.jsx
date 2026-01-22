import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

function UserProfile() {
const navigate = useNavigate();
const [userData, setUserData]= useState({
  Name: '',
  User_ID: '',
  Email: '',
  Phone: '',
  Role: '',
});

const [editing_Phone, set_editing_Phone] = useState(false);
const[temp_Phone, set_temp_Phone] = useState('');
const [loading, setLoading] = useState(false);
const [message, setMessage] = useState('');

useEffect(() => {
  const storedUserData = JSON.parse(localStorage.getItem('userData'));
  if (storedUserData) {
    setUserData(storedUserData);
  }else{
    navigate('/login');
  }
}, [navigate]);


const handle_Edit = () => {
  set_temp_Phone(userData.Phone || '');
  set_editing_Phone(true);
};

const handle_save = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMessage('');
  try {
    const response = await fetch('http://localhost:5000/api/update_phone', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
        body: JSON.stringify({
        User_ID: userData.User_ID,
        Phone: temp_Phone,
      }),
      });
    const data = await response.json();
    if (response.ok) {
      const updatedUserData = { ...userData, Phone: temp_Phone };
      setUserData(updatedUserData);
      localStorage.setItem('userData', JSON.stringify(updatedUserData));
      set_editing_Phone(false);
      setMessage('Phone updated successfully!');
    } else {
      setMessage(data.message || 'Failed to update Phone');
    }
  } catch (error) {
    console.error('Error updating Phone:', error);
    setMessage('Error connecting to server');
  }
  setLoading(false);
};

  const backgroundstyle = {
    width: '100%',
    minHeight: '97.8vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  };

  const cardStyle = {
    width: '85%',
    maxWidth: '700px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
    overflow: 'hidden'
  };

  const headerstyle = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '30px 20px',
    color: '#ffffff',
    textAlign: 'center',
    fontSize: '26px',
    fontWeight: 'bold'
  };

  const contentStyle = {
    padding: '30px'
  };

  const fieldStyle = {
    marginBottom: '20px',
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    border: '1px solid #e9ecef'
  };

  const labelStyle = {
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#6c757d',
    textTransform: 'uppercase',
    marginBottom: '8px',
    display: 'block'
  };

  const valueStyle = {
    fontSize: '16px',
    color: '#212529'
  };

  const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#667eea',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer'
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    border: '2px solid #667eea',
    borderRadius: '6px',
    marginBottom: '10px',
    boxSizing: 'border-box'
  };

  const messageStyle = {
    padding: '12px',
    marginBottom: '20px',
    borderRadius: '6px',
    backgroundColor: message.includes('success') ? '#d4edda' : '#f8d7da',
    color: message.includes('success') ? '#155724' : '#721c24',
    border: `1px solid ${message.includes('success') ? '#c3e6cb' : '#f5c6cb'}`
  };

  return (
    <div style={backgroundstyle}>
      <div style={cardStyle}>
        <div style={headerstyle}>User Profile</div>
        <div style={contentStyle}>
          {message && <div style={messageStyle}>{message}</div>}
          <div style={fieldStyle}>
            <label style={labelStyle}>Username</label>
            <div style={valueStyle}>{userData.Name}</div>
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>User ID</label>
            <div style={valueStyle}>{userData.User_ID}</div>
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Email</label>
            <div style={valueStyle}>{userData.Email}</div>
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Phone</label>
            {editing_Phone ? (
              <>
                <input
                  type="tel"
                  value={temp_Phone}
                  onChange={(e) => set_temp_Phone(e.target.value)}
                  style={inputStyle}placeholder="Enter phone number"/>
                <div style={{display: 'flex', gap: '10px'}}>
                  <button onClick={handle_save} style={buttonStyle}disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
                  <button onClick={handleCancel} style={{...buttonStyle, backgroundColor: '#6c757d'}}>Cancel</button>
                </div>
              </>
            ) : (
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div style={valueStyle}>{userData.Phone || 'Not set'}</div>
                <button onClick={handle_Edit} style={buttonStyle}>Edit</button>
              </div>
            )}
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Role</label>
            <div style={valueStyle}>{userData.Role}</div>
          </div>
          <button onClick={() => navigate(-1)} style={{...buttonStyle, width: '100%', marginTop: '20px',backgroundColor: '#ffffff',color: '#667eea',border: '2px solid #667eea'}}>Back</button>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;