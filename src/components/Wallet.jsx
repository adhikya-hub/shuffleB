import { useEffect, useState } from "react";
import { getCurrentUser } from "../utils/storage";
import { updateBalance } from "../utils/wallet";
import { Box, Typography, Button, Divider } from "@mui/material";

const Wallet = () => {
  const [balance, setBalance] = useState(0);

  /* Sync Balance */
  useEffect(() => {
    const syncBalance = () => {
      const user = getCurrentUser();
      setBalance(user?.balance || 0);
    };

    syncBalance();

    window.addEventListener("balanceUpdated", syncBalance);
    return () =>
      window.removeEventListener("balanceUpdated", syncBalance);
  }, []);

  /* Add Money */
  const handleAddMoney = () => {
    updateBalance(500);
    window.dispatchEvent(new Event("balanceUpdated"));
  };

  /* Withdraw Money (with safety check) */
  const handleWithdrawMoney = () => {
    if (balance < 500) return;

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
        boxShadow: "0 10px 30px rgba(10,38,255,0.4)",
      }}
    >
      {/* Balance Display */}
      <Box>
        <Typography sx={{ fontSize: 14, opacity: 0.8 }}>
          Balance
        </Typography>

        <Typography
          sx={{
            fontSize: { xs: 32, sm: 46 },
            fontWeight: 600,
            textShadow: "0 0 12px rgba(255,255,255,0.6)",
          }}
        >
          ₹{balance}
        </Typography>
      </Box>

      {/* Actions */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Button
          variant="text"
          onClick={handleAddMoney}
          sx={{
            color: "white",
            flex: 1,
            "&:hover": {
              background: "rgba(255,255,255,0.1)",
            },
          }}
        >
          Add + ₹500
        </Button>

        <Divider
          orientation="vertical"
          flexItem
          sx={{
            borderColor: "white",
            opacity: 0.5,
          }}
        />

        <Button
          variant="text"
          onClick={handleWithdrawMoney}
          disabled={balance < 500}
          sx={{
            color: "white",
            flex: 1,
            "&:hover": {
              background: "rgba(255,255,255,0.1)",
            },
          }}
        >
          Withdraw - ₹500
        </Button>
      </Box>
    </Box>
  );
};

export default Wallet;