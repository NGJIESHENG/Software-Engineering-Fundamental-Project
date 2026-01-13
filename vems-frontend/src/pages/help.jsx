import React from 'react';

function Help() {
const backgroundstyle = {
        width: '100%',
        background: 'linear-gradient(135deg, #2419F0, #6F58FF)',
        display: 'flex',
        justifyContent: 'flex-start',
        flexDirection:'column',
        alignItems: 'center',
        height: 'auto',
        minHeight:'97.5vh',
        paddingtop:'20px',
};
const headerstyle = {
  padding: '5px',
  color : 'white',
  textAlign:'center'
};
const cardStyle = {
  width: '90%',
  maxWidth: '700px',
  height: 'auto',
  minHeight:'400px',
  backgroundColor: '#f7fafc',
  border: '5px solid #ccc',
  borderRadius: '20px',
  flexDirection: 'column',
  display: 'flex',
  margin:'25px auto',
  padding:'20px',
};
const Style = {
  questionstyle:{
    fontWeight: 'bold',
    padding: '5px',
  },
  question:{

  },
  answer:{

  },
};
return (
<div style={backgroundstyle}>
    <div style ={headerstyle}>
        <h1>Help Centre</h1>
    </div>
    <div style={{...cardStyle}}>
        <div style ={Style.questionstyle}>
            <h3>Frequently Asked Questions</h3>
            <p><strong>Login Issues:</strong> Ensure your User ID and Password match.</p>
            <p><strong>Profile:</strong> Update your phone number in the User Profile section.</p>
        </div>
    </div>
</div>
);
}

export default Help;