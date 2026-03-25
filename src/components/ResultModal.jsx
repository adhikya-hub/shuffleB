import { Modal, Box, Typography, Button } from "@mui/material";

const ResultModal = ({ open, type, amount, onClose }) => {
  return (
    <Modal open={open}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 320,
          bgcolor: "#111",
          borderRadius: 3,
          boxShadow: 24,
          p: 4,
          textAlign: "center",
          color: "white"
        }}
      >
        {type === "win" ? (
          <>
            <Typography variant="h5" sx={{ mb: 2, color: "#0a26ff" }}>
               You Won!
            </Typography>

            <Typography>You earned ₹{amount}</Typography>
          </>
        ) : (
          <>
            <Typography variant="h5" sx={{ mb: 2, color: "#ff3b3b" }}>
               You Lost
            </Typography>

            <Typography>Better luck next time!</Typography>
          </>
        )}

        <Button
          variant="contained"
          sx={{
            mt: 3,
            background: "#0a26ff",
            "&:hover": { background: "#081dcc" }
          }}
          onClick={onClose}
        >
          Play Again
        </Button>
      </Box>
    </Modal>
  );
};

export default ResultModal;