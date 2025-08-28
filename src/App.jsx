import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


import MainPage from './pages/MainPage';
import ServicesPage from './pages/SerivcesPage';
import Projects from './pages/Projects';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BeforeAfterGallery from './pages/BeforeAfterGallery';
import Contactpage from './pages/ContactPage';


function App() {
  return (
    <>
      <div className="w-full mx-auto">
        <Router>
          <Routes>
          
            
            {/* Public routes with Navbar and Footer */}
            <Route
              path="/*"
              element={
                <>
                  <Navbar />
                  <Routes>
                    <Route
                      path="/"
                      element={<MainPage />}
                    />
                     
                    <Route
                      path="/services"
                      element={<ServicesPage />}
                    />
                    <Route
                      path="/contact"
                      element={<Contactpage />}
                    />
                    <Route
                      path="/projects"
                      element={<Projects />}
                    />
                    <Route
                      path="/projects/:id/before-after"
                      element={<BeforeAfterGallery />}
                    />
                  </Routes>
                  <Footer />
                </>
              }
            />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;