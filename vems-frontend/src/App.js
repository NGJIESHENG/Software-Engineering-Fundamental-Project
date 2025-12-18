import React from 'react';

// This is "Mock Data" - we use this until our Flask backend is ready 
const mockEvents = [
  { id: 1, name: "SE Lecture", venue: "Classroom 101", date: "2025-12-20", time: "10:00 AM" },
  { id: 2, name: "Career Fair", venue: "Auditorium", date: "2025-12-21", time: "02:00 PM" },
  { id: 3, name: "Math Workshop", venue: "Lab 2", date: "2025-12-22", time: "09:00 AM" },
];

function App() {
  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Campus Event Schedule</h1>
      <p>View upcoming events and venue bookings[cite: 26, 88].</p>
      
      {/* This table matches your SRS requirement 3.1.1  */}
      <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2" }}>
            <th>Event Name</th>
            <th>Venue</th>
            <th>Date</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {mockEvents.map((event) => (
            <tr key={event.id}>
              <td>{event.name}</td>
              <td>{event.venue}</td>
              <td>{event.date}</td>
              <td>{event.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;