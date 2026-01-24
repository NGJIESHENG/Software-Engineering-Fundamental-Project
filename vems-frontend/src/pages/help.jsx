import React from 'react';

function Help() {
  const backgroundStyle = {
    width: '100%',
    minHeight: '97.5vh',
    background: 'linear-gradient(135deg,#c1e2ff, #d6f2ff)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '20px',
  };
  const headerStyle = {
    color: '#ffffff',
    marginBottom: '20px',
    fontSize: '32px',
    fontWeight: '700',
  };
  const cardStyle = {
    width: '90%',
    maxWidth: '700px',
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    padding: '20px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.25)',
  };
  const styles = {
    faqItem: {
      marginBottom: '22px',
    },
    question: {
      backgroundColor: '#cad5f9',
      color: '#1e3a8a',
      padding: '15px',
      borderRadius: '8px',
      fontWeight: '600',
      fontSize: '16px',
    },
    answer: {
      backgroundColor: '#f9fafb',
      padding: '15px',
      borderLeft: '5px solid #4f46e5',
      marginTop: '10px',
      borderRadius: '5px',
      fontSize: '15px',
      color: '#333333',
      lineHeight: '1.6',
    },
    link: {
      display: 'inline-block',
      marginTop: '15px',
      color: '#4f46e5',
      textDecoration: 'none',
      fontWeight: '600',
      fontSize: '15px',
    },
    highlight: {
      color: '#1d4ed8',
      fontWeight: '600',
    },
  };
  return (
    <div style={backgroundStyle}>
      <h1 style={headerStyle}>Help Centre</h1>
      <div style={cardStyle}>
        <div style={styles.faqItem}>
          <div style={styles.question}>
            How do I update my phone number?
          </div>
          <div style={styles.answer}>
            Go to your User Profile page and click the "Edit" button next to your phone number.
          </div>
        </div>
        <div style={styles.faqItem}>
          <div style={styles.question}>
            Why is my Username blank?
          </div>
          <div style={styles.answer}>
            Please log out and log back in to refresh your account details.
          </div>
        </div>
        <div style={styles.faqItem}>
          <div style={styles.question}>
            How to contact us?
          </div>
          <div style={styles.answer}>
            Campus IT support email:
            <span style={styles.highlight}> it-support@campus.edu</span>
            <br />
            Call: <span style={styles.highlight}>+60 3-1234 5678</span>
          </div>
        </div>
        <a href="/homepage" style={styles.link}>← Back to Home</a>
      </div>
    </div>
  );
}

export default Help;
