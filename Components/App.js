import { BrowserRouter as Router, Routes, Route,Navigate } from 'react-router-dom';
import RegistrationForm from './RegistrationForm';
import Login from './Login'; 
import DashboardPage from './DashboardPage';
import PrimaryPage from './PrimaryPage';
import SecondaryPage from './SecondaryPage';
import SeniorPage from './SeniorPage';
import AdminPage from './AdminPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/dashboard" element={<DashboardPage />}/>
        <Route path="/primary" element={<PrimaryPage/>}/>
        <Route path="/secondary" element={<SecondaryPage/>}/>
        <Route path="/seniors" element={<SeniorPage/>}/>
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>

  );
}

export default App;