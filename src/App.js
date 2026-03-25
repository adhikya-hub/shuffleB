import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Game from "./components/Game";
import Admin from "./components/Admin";
import { getCurrentUser } from "./utils/storage";
import Nav from "./components/Nav";


const PrivateRoute = ({ children }) => {
  const user = getCurrentUser();
  return user ? children : <Navigate to="/login" />;
};

function App() {
  const user = getCurrentUser();

  return (
    <Router>
      
    <Nav />  
  
      <Routes>

        <Route
          path="/"
          element={!user ? <Signup /> : <Navigate to="/game" />}
        />

        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/game" />}
        />

        <Route
          path="/game"
          element={
            <PrivateRoute>
              <Game />
            </PrivateRoute>
          }
        />

        <Route path="/admin" element={<Admin />} />

      </Routes>
    </Router>
  );
}

export default App;