import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h1>Event Management Platform</h1>
      <nav>
         <Link style={{marginRight: '1rem'}} to="/login">Login</Link>
         <Link style={{marginRight: '1rem'}} to="/events-view">Events</Link>
         <Link style={{marginRight: '1rem'}} to="/booking-view">Booking</Link>
         <Link style={{marginRight: '1rem'}} to="/tickets-view">Tickets</Link>
         <Link style={{marginRight: '1rem'}} to="/payment-view">Payment</Link>
         <Link style={{marginRight: '1rem'}} to="/notifications-view">Notifications</Link>
      </nav>
    </div>
  );
}

function GenericView({ title, apiPath }) {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch(apiPath)
      .then(res => res.json())
      .then(d => setData(d))
      .catch(err => console.error(err));
  }, [apiPath]);
  
  return (
    <div>
      <h2>{title}</h2>
      <pre>{data ? JSON.stringify(data, null, 2) : 'Loading...'}</pre>
      <Link to="/">Back to Home</Link>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<GenericView title="Login / Users" apiPath="/users" />} />
          <Route path="/events-view" element={<GenericView title="Events" apiPath="/events" />} />
          <Route path="/booking-view" element={<GenericView title="Bookings" apiPath="/booking" />} />
          <Route path="/tickets-view" element={<GenericView title="Tickets" apiPath="/tickets" />} />
          <Route path="/payment-view" element={<GenericView title="Payments" apiPath="/payment" />} />
          <Route path="/notifications-view" element={<GenericView title="Notifications" apiPath="/notifications" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
