import React, {useState, useEffect} from 'react';

function UserProfile() {
const [userData, setUserData]= useState({
  username: '',
  user_ID: '',
  email: '',
  phone: '',
  role: '',
});

const [editing_Phone, set_editing_Phone] = useState(false);
const[temp_Phone, set_temp_Phone] = useState('');
const [loading, setLoading] = useState(false);
const [message, setMessage] = useState('');

useEffect(() => {
  const storedUserData = JSON.parse(localStorage.getItem('userData'));
  if (storedUserData) {
    setUserData(storedUserData);
  }
}, []);


const handle_Edit = () => {
  set_temp_Phone(userData.phone || '');
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
        userId: userData.user_ID,
        phone: temp_Phone,
      }),
      });
    const data = await response.json();
    if (response.ok) {
      const updatedUserData = { ...userData, phone: temp_Phone };
      setUserData(updatedUserData);
      localStorage.setItem('userData', JSON.stringify(updatedUserData));
      set_editing_Phone(false);
      setMessage('Phone updated successfully!');
    } else {
      setMessage(data.message || 'Failed to update phone');
    }
  } catch (error) {
    console.error('Error updating phone:', error);
    setMessage('Error connecting to server');
  }
  setLoading(false);
};

const backgroundstyle = {
        width: '100%',
        background: 'linear-gradient(135deg, #2419F0, #6F58FF)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'stretch',
        height: '97.8vh',
    };
  
  const headerstyle = {
  padding: '20px',
  flexShrink: 0,
};

const cardStyle = {
  width: '95%',
  maxWidth: '700px',
  height: '85%',
  backgroundColor: '#f7fafc',
  border: '5px solid #ccc',
  borderRadius: '10px',
  display: 'flex',
  flexDirection: 'column',
  margin:'25px'
};

const contentStyle = {
  padding: '30px',
  lineHeight: '4.7',
};

const backstyle = {
  color: '#00bbf5ff' ,
  fontSize:'10',
  paddingLeft: '600px',
  alignSelf: 'flex-end',
}

return (
  <div style={backgroundstyle}>
    <div style={{...cardStyle}}>
      <div style ={headerstyle}> 
        <h2>User Profile</h2> 
      </div>
      <div style ={contentStyle}>
      <p><strong>Username:</strong> {userData.username}</p>
      <p><strong>User ID:</strong> {userData.user_ID}</p>
      <p><strong>Email:</strong>{userData.email}</p>
      <p>
        <strong>Phone:</strong>
        {editing_Phone ? (
          <>
            <input
              type="text"
              value={temp_Phone}
              onChange={(e) => set_temp_Phone(e.target.value)}
              style={{ marginLeft: '10px', padding: '5px' }}
            />
            <button onClick={handle_save} style={{ marginLeft: '10px' }}>Save</button>
          </>
        ) : (
          <>
            <span style={{ marginLeft: '10px' }}>{userData.phone || 'Not set'}</span>
            <button onClick={handle_Edit} style={{ marginLeft: '10px' }}>Edit</button>
          </>
        )}
      </p>
      <p><strong>Role:</strong> {userData.role}</p>
      </div>
      <a href="/homepage" style={{ ...backstyle}}>Back</a>
    </div>
  </div>

  );
}
export default UserProfile;