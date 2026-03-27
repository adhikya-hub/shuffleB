import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { getCurrentUser } from "../utils/storage";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";

const Nav = () => {
  const user = getCurrentUser();
  const navigate = useNavigate();

  //logout and redirect to login page
  const handleLogout = () => {
    localStorage.removeItem("currentUser");

    window.location.reload(); //to rerender
    navigate("/login");
  };

  //no navbar until user is logged in
  if (!user) return null;

  return (
    <AppBar position="static" sx={{ background: "#181818" }}>
      <Toolbar>
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            color: "#0a26ff",
            fontFamily: '"Copperplate", "Copperplate Gothic Bold", serif',
            fontSize: "2rem",
            fontWeight: 700,
            letterSpacing: "0.05em",
          }}
        >
          ShuffleB
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <AccountCircleIcon />

          <Typography
            variant="body1"
            sx={{
              maxWidth: 90,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {user.username}
          </Typography>

          <Button
            variant="text"
            onClick={handleLogout}
            sx={{
              color: "#0a26ff",
              marginLeft: 1,
            }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Nav;
