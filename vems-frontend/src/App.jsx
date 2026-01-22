import { Routes, Route, Navigate } from 'react-router-dom';
import RegisterPage from './pages/register';
import LoginPage from './pages/login';
import Homepage from './pages/homepage';
import Dashboard from './pages/dashboard';
import UserProfile from './pages/user-profile';
import Calendar from './pages/calendar';
import Mybooking from './pages/my-booking';
import Booking from './pages/booking';
import BookingForm from './pages/bookingform';
import Help from './pages/help';
import AdminDashboard from './pages/admindashboard';
import Notifications from './pages/notifications';
import ModifyDetails from './pages/modifydetails';

function App() {
  return (
    <Routes>
    <Route path="/" element={<LoginPage/>}/>
    <Route path="/register" element={<RegisterPage/>}/>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/admin-dashboard" element={<AdminDashboard />} />
    <Route path="/homepage" element={<Homepage />} />
    <Route path="/dashboard" element={<Dashboard/>}/>
    <Route path="/user-profile" element={<UserProfile/>}/>
    <Route path="/calendar" element={<Calendar/>}/>
    <Route path="/my-booking" element={<Mybooking/>}/>
    <Route path="/booking" element={<Booking/>}/>
    <Route path="/help" element={<Help/>}/>
    <Route path="/bookingform" element={<BookingForm/>}/>
    <Route path="*" element={<Navigate to="/" />}/>
    <Route path="/notifications" element={<Notifications/>}/>
    <Route path="/modifydetails" element={<ModifyDetails/>}/>
    </Routes>
  );
}

export default App;