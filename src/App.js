import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Game from "./components/Game";
import Admin from "./components/Admin";
import { getCurrentUser } from "./utils/storage";
import Navbar from "./components/Navbar";


// Protected Route
const PrivateRoute = ({ children }) => {
  const user = getCurrentUser();
  return user ? children : <Navigate to="/login" />;
};

function App() {
  const user = getCurrentUser();

  return (
    <Router>
      
    <Navbar />  
  
      <Routes>

        {/* ✅ Signup (default) */}
        <Route
          path="/"
          element={!user ? <Signup /> : <Navigate to="/game" />}
        />

        {/* ✅ Login */}
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/game" />}
        />

        {/* ✅ Game (Protected) */}
        <Route
          path="/game"
          element={
            <PrivateRoute>
              <Game />
            </PrivateRoute>
          }
        />

        {/* Admin */}
        <Route path="/admin" element={<Admin />} />

      </Routes>
    </Router>
  );
}

export default App;