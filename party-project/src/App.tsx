import './App.css'
import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Events from "./Pages/Events";
import Admin from "./Pages/Admin";
import Footer from "./Components/Footer";
import EventDetail from './Components/EventDetail';
import AdminEventDetails from './Pages/AdminEventDetails';
import InviteEventDetail from './Pages/InviteEventDetail';
import InvitePage from './Pages/InvitePage';

function App() {
  console.log("URL:", import.meta.env.VITE_SUPABASE_URL)
  return(
    <div className="flex flex-col min-h-screen bg-linear-to-b from-pink-100 to-mauve-100" >
      <div className="grow " >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:eventId" element={<EventDetail />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/:eventId" element={<AdminEventDetails />} />
          <Route path="/invite/:token" element={<InvitePage />} />
          <Route path="/invite/:token/:eventId" element={<InviteEventDetail />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App
