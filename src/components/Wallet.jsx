import { useEffect, useState } from "react";
import { getCurrentUser } from "../utils/storage";
import { updateBalance } from "../utils/wallet";
import { Box, Typography, Button } from "@mui/material";
import { Divider } from "@mui/material";

const Wallet = () => {
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const update = () => {
      setBalance(getCurrentUser()?.balance || 0);
    };

    update();

    window.addEventListener("balanceUpdated", update);
    return () => window.removeEventListener("balanceUpdated", update);
  }, []);

  const addMoney = () => {
    updateBalance(500);
    window.dispatchEvent(new Event("balanceUpdated"));
  };

  const removeMoney = () => {
    updateBalance(-500);
    window.dispatchEvent(new Event("balanceUpdated"));
  };
  

  return (
    <Box
      sx={{
        width: { xs: "90%", sm: 350, md: 400 },
        height: { xs: 180, sm: 200 },
        margin: "20px auto",
        borderRadius: 4,
        background: "#0a26ff",
        color: "white",
        padding: 3,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow: "0 10px 30px rgba(10,38,255,0.4)"
      }}
    >
      <Box>
      {/* Balance Text */}
      <Typography sx={{ fontSize: 14, opacity: 0.8 }}>
        Balance
      </Typography>

      {/* Amount */}
      <Typography
        sx={{
          fontSize: { xs: 32, sm: 46 },
          fontWeight: 600,
          textShadow: "0 0 12px rgba(255,255,255,0.6)"
        }}
      >
        ₹{balance}
      </Typography>
      </Box>

      {/* Buttons */}
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button
          variant="text"
          onClick={addMoney}
          sx={{
            color: "white",
            borderColor: "white",
            flex: 1,
            "&:hover": {
              borderColor: "white",
              background: "rgba(255,255,255,0.1)"
            }
          }}
        >
        Add + ₹500
        </Button>
        <Divider
    orientation="vertical"
    flexItem
    sx={{
      borderColor: "white",
      mx: 1,
      opacity: 0.5
    }}
  />

        <Button
          variant="text"
          onClick={removeMoney}
          sx={{
            color: "white",
            borderColor: "white",
            flex: 1,
            "&:hover": {
              borderColor: "white",
              background: "rgba(255,255,255,0.1)"
            }
          }}
        >
         Withdraw - ₹500
        </Button>
      </Box>
    </Box>
  );
};

export default Wallet;