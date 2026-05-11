import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Venues from './pages/Venues';
import VenueDetail from './pages/VenueDetail';
import Profile from './pages/Profile';
import EditVenue from './pages/manager/EditVenue';
import CreateVenue from './pages/manager/CreateVenue';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/venues" element={<Venues />} />
          <Route path="/venues/:id" element={<VenueDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-venue" element={<CreateVenue />} />
          <Route path="/edit-venue/:id" element={<EditVenue />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}