import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  MenuItem,
} from "@mui/material";
import { getUsers, saveUsers } from "../utils/storage";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [sortType, setSortType] = useState("balanceDesc");

  const [showAddForm, setShowAddForm] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newBalance, setNewBalance] = useState("");

  /*Load users */
  useEffect(() => {
    const data = getUsers();
    setUsers(Array.isArray(data) ? data : []);
  }, []);

  const updateUsers = (updatedUsers) => {
    saveUsers(updatedUsers);
    setUsers(updatedUsers);
  };

  /* Add User */
  const handleAddUser = () => {
    const username = newUsername.trim();
    const balance = Number(newBalance);

    if (!username || !balance) {
      return alert("Fill all fields");
    }

    const currentUsers = getUsers() || [];

    const exists = currentUsers.find(
      (user) => user?.username === username
    );

    if (exists) {
      return alert("User already exists");
    }

    const updatedUsers = [
      ...currentUsers,
      {
        username,
        password: "12345678",
        balance,
      },
    ];

    updateUsers(updatedUsers);

    setNewUsername("");
    setNewBalance("");
    setShowAddForm(false);
  };

  /* Delete User */
  const handleDeleteUser = (username) => {
    const updatedUsers = users.filter(
      (user) => user?.username !== username
    );
    updateUsers(updatedUsers);
  };

  /* Update Balance */
  const handleBalanceUpdate = (username, value) => {
    const updatedUsers = users.map((user) => {
      if (user?.username === username) {
        return { ...user, balance: Number(value) };
      }
      return user;
    });

    updateUsers(updatedUsers);
  };

  /* Filtering */
  const filteredUsers = users.filter((user) => {
    if (!user || !user.username) return false;
    return user.username.toLowerCase().includes(search.toLowerCase());
  });

  /* Sorting */
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortType === "balanceAsc") return a.balance - b.balance;
    if (sortType === "balanceDesc") return b.balance - a.balance;
    if (sortType === "alpha")
      return a.username.localeCompare(b.username);
    return 0;
  });

  const totalUsers = users.length;
  const totalBalance = users.reduce(
    (sum, user) => sum + (user?.balance || 0),
    0
  );

  return (
    <Box sx={{ padding: 3 }}>
      {/* Disclaimer */}
      <Box
        sx={{
          mb: 2,
          p: 2,
          borderRadius: 2,
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <Typography sx={{ fontSize: 14, color: "#ccc" }}>
          ⚠️ Demo Mode: This application uses localStorage for data persistence. Admin access is available to all logged-in users for demonstration purposes.
        </Typography>
      </Box>

      <Typography variant="h4" sx={{ mb: 2 }}>
        Admin Panel
      </Typography>

      {/* Stats */}
      <Box sx={{ display: "flex", gap: 4, mb: 3 }}>
        <Typography>Total Users: {totalUsers}</Typography>
        <Typography>Total Balance: ₹{totalBalance}</Typography>
      </Box>

      {/* Sorting and Search */}
      <Box sx={{ p: 2 }}>
        <TextField
          select
          label="Sort"
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
          size="small"
          sx={{
            minWidth: 150,
            mr: 2,
            "& .MuiInputBase-input": { color: "white" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#aaa" },
              "&:hover fieldset": { borderColor: "#fff" },
            },
            "& .MuiInputLabel-root": { color: "#aaa" },
            "& .MuiSvgIcon-root": { color: "white" },
          }}
        >
          <MenuItem value="balanceDesc">Balance ↓</MenuItem>
          <MenuItem value="balanceAsc">Balance ↑</MenuItem>
          <MenuItem value="alpha">A → Z</MenuItem>
        </TextField>

        <TextField
          label="Search user"
          size="small"
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            "& .MuiInputBase-input": { color: "white" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#fff" },
            },
            "& .MuiInputLabel-root": { color: "#ccc" },
          }}
        />
      </Box>

      {/* Add User */}
      <Box sx={{ p: 2 }}>
        {!showAddForm ? (
          <Button variant="contained" onClick={() => setShowAddForm(true)}>
            Add User
          </Button>
        ) : (
          <Box sx={{ display: "flex", gap: 2, mt: 2, flexWrap: "wrap" }}>
            <TextField
              label="Username"
              size="small"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              sx={{
                "& .MuiInputBase-input": { color: "white" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#fff" },
                  "&:hover fieldset": { borderColor: "#fff" },
                },
                "& .MuiInputLabel-root": { color: "#ccc" },
              }}

            />

            <TextField
              label="Balance"
              type="number"
              size="small"
              value={newBalance}
              onChange={(e) => setNewBalance(e.target.value)}
              sx={{
                "& .MuiInputBase-input": { color: "white" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#fff" },
                  "&:hover fieldset": { borderColor: "#fff" },
                },
                "& .MuiInputLabel-root": { color: "#ccc" },
              }}
            />

            <Button variant="contained" onClick={handleAddUser}>
              Add
            </Button>

            <Button variant="outlined" onClick={() => setShowAddForm(false)}>
              Cancel
            </Button>
          </Box>
        )}
      </Box>

      {/* Users Table */}
      <Paper sx={{ background: "#4d4d4d", color: "white" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "white" }}>Username</TableCell>
              <TableCell sx={{ color: "white" }}>Balance</TableCell>
              <TableCell sx={{ color: "white" }}>Edit Balance</TableCell>
              <TableCell sx={{ color: "white" }}>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {sortedUsers.map((user) => (
              <TableRow key={user.username}>
                <TableCell>{user.username}</TableCell>

                <TableCell>₹{user.balance}</TableCell>

                <TableCell>
                  <TextField
                    type="number"
                    defaultValue={user.balance}
                    size="small"
                    onBlur={(e) =>
                      handleBalanceUpdate(user.username, e.target.value)
                    }
                  />
                </TableCell>

                <TableCell>
                  <Button
                    color="error"
                    variant="contained"
                    onClick={() => handleDeleteUser(user.username)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default Admin;