import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ProjectForm from './pages/ProjectFormPage';
import ProjectDashboard from './pages/ProjectDashboard';
import ProjectUpdate from './pages/ProjectUpdate';
import MainPage from './pages/MainPage';
import AlertsTable from './pages/AlertsTablePage';
import ServicesPage from './pages/SerivcesPage';
import Projects from './pages/Projects';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BeforeAfterGallery from './pages/BeforeAfterGallery';
import Contactpage from './pages/ContactPage';
import NotesApp from './pages/NotesPage';
import AdminDashboard from './pages/AdminDashboard'
import AdminProfile from './pages/AdminProfile';
import AdminLoginPage from './pages/Adminlogin';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';

function App() {
  return (
    <>
      <div className="w-full mx-auto">
        <Router>
          <Routes>
            <Route
                      path="/admin-login"
                      element={<AdminLoginPage />}
                    />
            <Route
              path="/admin"
              element={      <ProtectedAdminRoute>
<AdminDashboard />      </ProtectedAdminRoute>
}
            />
            <Route
              path="/admin/dashboard/project-form"
              element={      <ProtectedAdminRoute>
<ProjectForm />      </ProtectedAdminRoute>
}
            />
            <Route
              path="/admin/dashboard"
              element={     <ProtectedAdminRoute>
<ProjectDashboard />      </ProtectedAdminRoute>
}
            />
            <Route
              path="/admin/dashboard/project-update/:id"
              element={      <ProtectedAdminRoute>
<ProjectUpdate />      </ProtectedAdminRoute>
}
            />
            <Route
              path="/admin/alerts"
              element={      <ProtectedAdminRoute>
<AlertsTable />      </ProtectedAdminRoute>
}
            />
            <Route
              path="/admin/notes"
              element={     <ProtectedAdminRoute>
<NotesApp />      </ProtectedAdminRoute>
}
            />
            <Route
              path="/admin/Profile"
              element={      <ProtectedAdminRoute>
<AdminProfile />      </ProtectedAdminRoute>
}
            />
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