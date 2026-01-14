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
  color : '#ffffff',
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
  question:{
    backgroundColor:'#5e5d5d',
    padding:'15px',
    borderRadius:'1px',
  },
  answer:{
    backgroundColor:'#d7d7d7',
    padding:'15px',
    border: '1px solid #7c7c7c',
    marginBottom: '20px',
  },
};
return (
  <div style={backgroundstyle}>
      <div style ={headerstyle}>
          <h1>Help Centre</h1>
      </div>
      <div style={{...cardStyle}}>
          <div>
            <div style={Style.question}>How do I update my phone number?</div>
            <div style={Style.answer}>
              Go to your User Profile page and click the "Edit" button next to your phone number.
            </div>
          </div>
          <div>
            <div style={Style.question}>Why is my Username blank?</div>
            <div style={Style.answer}>
              Please log out and log back in to refresh your account details.
            </div>
      </div>
  </div>
</div>
);
}

export default Help;