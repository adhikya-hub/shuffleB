import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./components/Login";
import Signup from "./components/Signup";
import Game from "./components/Game";
import Admin from "./components/Admin";
import Nav from "./components/Nav";

import { getCurrentUser } from "./utils/storage";


const PrivateRoute = ({ children }) => {
  const user = getCurrentUser();

  return user ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <Nav />

      <Routes>
        
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/game"
          element={
            <PrivateRoute>
              <Game />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <Admin />
            </PrivateRoute>
          }
        />

        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;