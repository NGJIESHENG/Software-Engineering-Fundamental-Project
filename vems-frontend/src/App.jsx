import { Routes, Route, Navigate } from 'react-router-dom';
import RegisterPage from './pages/register';
import LoginPage from './pages/login';
import Homepage from './pages/homepage';
import Dashboard from './pages/dashboard';

function App() {
  return (
    <Routes>
    <Route path="/" element={<RegisterPage/>} />
    <Route path="/login" element={<LoginPage/>}/>
    <Route path="/homepage" element={<Homepage />} /> 
    <Route path="/dashboard" element={<Dashboard/>}/>

    <Route path="*" element={<Navigate to="/" />}/>
    </Routes>
  );
}

export default App;