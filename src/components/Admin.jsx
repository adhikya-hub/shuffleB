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
  MenuItem
} from "@mui/material";
import { getUsers, saveUsers } from "../utils/storage";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [sortType, setSortType] = useState("balanceDesc");
  const [showAddForm, setShowAddForm] = useState(false);
const [newEmail, setNewEmail] = useState("");
const [newBalance, setNewBalance] = useState("");

  useEffect(() => {
    setUsers(getUsers());
  }, []);

  // 🔄 Save + refresh
  const updateUsers = (updated) => {
    saveUsers(updated);
    setUsers(updated);
  };

  // ➕ Add user
 const handleAddUser = () => {
  if (!newEmail.trim() || !newBalance) return alert("Fill all fields");

  const currentUsers = getUsers();

  const exists = currentUsers.find(u => u.email === newEmail);
  if (exists) return alert("User already exists");

  const updated = [
    ...currentUsers,
    {
      email: newEmail,
      password: "12345678",
      balance: Number(newBalance)
    }
  ];

  saveUsers(updated);
  setUsers(updated);

  // 🔥 reset + hide form
  setNewEmail("");
  setNewBalance("");
  setShowAddForm(false);
};

  // ❌ Delete user
  const deleteUser = (email) => {
    const updated = users.filter(u => u.email !== email);
    updateUsers(updated);
  };

  // ✏️ Edit balance
  const updateBalance = (email, value) => {
    const updated = users.map(u => {
      if (u.email === email) {
        return { ...u, balance: Number(value) };
      }
      return u;
    });
    updateUsers(updated);
  };

  // 🔍 Search filter
  const filtered = users.filter(u =>
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  // 🔽 Sort by balance
  const sorted = [...filtered].sort((a, b) => {
  if (sortType === "balanceAsc") return a.balance - b.balance;
  if (sortType === "balanceDesc") return b.balance - a.balance;
  if (sortType === "alpha") return a.email.localeCompare(b.email);
  return 0;
});

  // 📊 Totals
  const totalUsers = users.length;
  const totalBalance = users.reduce((sum, u) => sum + u.balance, 0);

  return (
    <Box sx={{ padding: 3 }}>

      {/* 🔥 TITLE */}
      <Typography variant="h4" sx={{ mb: 2 }}>
        Admin Panel
      </Typography>

      {/* 📊 METRICS */}
      <Box sx={{ display: "flex", gap: 4, mb: 3 }}>
        <Typography>Total Users: {totalUsers}</Typography>
        <Typography>Total Balance: ₹{totalBalance}</Typography>
      </Box>

      <TextField
  select
  label="Sort"
  value={sortType}
  onChange={(e) => setSortType(e.target.value)}
  size="small"
  sx={{
    minWidth: 150,
    "& .MuiInputBase-input": {
      color: "white"
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#aaa"
      },
      "&:hover fieldset": {
        borderColor: "#fff"
      }
    },
    "& .MuiInputLabel-root": {
      color: "#aaa"
    },
    "& .MuiSvgIcon-root": {
      color: "white"
    }
  }}
>
  <MenuItem value="balanceDesc">Balance ↓</MenuItem>
  <MenuItem value="balanceAsc">Balance ↑</MenuItem>
  <MenuItem value="alpha">A → Z</MenuItem>
</TextField>

      {/* 🔍 SEARCH + ADD USER */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <TextField
          label="Search user"
          variant="outlined"
          size="small"
          onChange={(e) => setSearch(e.target.value)}
        />

        <TextField
          label="New user email"
          size="small"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
        />

        <Box sx={{ mb: 3 }}>

  {/* Button */}
  {!showAddForm && (
    <Button
      variant="contained"
      onClick={() => setShowAddForm(true)}
    >
      Add User
    </Button>
  )}

  {/* Form */}
  {showAddForm && (
    <Box sx={{ display: "flex", gap: 2, mt: 2, flexWrap: "wrap" }}>

      <TextField
        label="Email"
        size="small"
        value={newEmail}
        onChange={(e) => setNewEmail(e.target.value)}
        sx={{
          "& .MuiInputBase-input": { color: "white" },
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "#fff" },
            "&:hover fieldset": { borderColor: "#fff" }
          },
          "& .MuiInputLabel-root": { color: "#ccc" }
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
            "&:hover fieldset": { borderColor: "#fff" }
          },
          "& .MuiInputLabel-root": { color: "#ccc" }
        }}
      />

      <Button
        variant="contained"
        onClick={handleAddUser}
        sx={{
          background: "#0a26ff",
          "&:hover": { background: "#081dcc" }
        }}
      >
        Add
      </Button>

      <Button
        variant="outlined"
        onClick={() => setShowAddForm(false)}
        sx={{
          color: "white",
          borderColor: "white"
        }}
      >
        Cancel
      </Button>

    </Box>
  )}
</Box>
      </Box>

      {/* 📋 TABLE */}
      <Paper sx={{
    background: "#4d4d4d",
    color: "white",
    overflow: "hidden"
  }}>
        <Table>
          <TableHead>
  <TableRow sx={{ background: "#3a3a3a" }}>
    <TableCell sx={{ color: "white", fontWeight: 600 }}>Email</TableCell>
    <TableCell sx={{ color: "white", fontWeight: 600 }}>Balance</TableCell>
    <TableCell sx={{ color: "white", fontWeight: 600 }}>Edit Balance</TableCell>
    <TableCell sx={{ color: "white", fontWeight: 600 }}>Actions</TableCell>
  </TableRow>
</TableHead>

          <TableBody>
  {sorted.map((u) => (
    <TableRow
      key={u.email}
      sx={{
        "&:hover": {
          background: "#5a5a5a"
        }
      }}
    >
      <TableCell sx={{ color: "white" }}>{u.email}</TableCell>

      <TableCell sx={{ color: "white" }}>₹{u.balance}</TableCell>

      <TableCell>
        <TextField
          type="number"
          defaultValue={u.balance}
          size="small"
          onBlur={(e) => updateBalance(u.email, e.target.value)}
          sx={{
            input: { color: "white" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#aaa" }
            }
          }}
        />
      </TableCell>

      <TableCell>
        <Button color="error" variant= "contained" onClick={() => deleteUser(u.email)}>
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