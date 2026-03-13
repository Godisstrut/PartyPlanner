import './App.css'
import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Events from "./Pages/Events";
import Admin from "./Pages/Admin";
import Footer from "./Components/Footer";
import EventDetail from './Components/EventDetail';

function App() {
  return(
    <div className="flex flex-col min-h-screen bg-mist-50" >
      <div className="grow" >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:eventId" element={<EventDetail />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App
