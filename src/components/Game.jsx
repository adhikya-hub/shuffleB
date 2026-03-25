import { useEffect, useState } from "react";
import { Button, Box, Typography } from "@mui/material";
import { generateGame, shuffleUnmatched } from "../utils/game";
import { updateBalance } from "../utils/wallet";
import { getCurrentUser } from "../utils/storage";
import Wallet from "./Wallet";
import styles from "../styles/Game.module.css";
import { useSnackbar } from "notistack";
import ResultModal from "./ResultModal";

const rowStyle = {
  display: "flex",
  justifyContent: "center",
  gap: 2,
  mb: 2,
  flexWrap: "wrap"
};

const Game = () => {
  const [row1, setRow1] = useState([]);
  const [row2, setRow2] = useState([]);

  const [selected, setSelected] = useState([]);
  const [matched, setMatched] = useState([]);

  const [bet, setBet] = useState("");
  const [betPlaced, setBetPlaced] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [attempts, setAttempts] = useState(20);

  const [resultOpen, setResultOpen] = useState(false);
  const [resultType, setResultType] = useState("");
  const [winAmount, setWinAmount] = useState(0);

  const { enqueueSnackbar } = useSnackbar();

 
  useEffect(() => {
    const { row1, row2 } = generateGame();
    setRow1(row1);
    setRow2(row2);
  }, []);

  // shuffle when not active
  useEffect(() => {
    if (!gameStarted) return;

    const interval = setInterval(() => {
      shuffleAll(matched);
    }, 5000);

    return () => clearInterval(interval);
  }, [matched, gameStarted]);

  const placeBet = () => {
    const betAmount = Number(bet);

    if (!betAmount || betAmount <= 0)
      return enqueueSnackbar("Enter valid bet", { variant: "warning" });

    if (betAmount > 5000)
      return enqueueSnackbar("Max bet ₹5000", { variant: "warning" });

    const user = getCurrentUser();
    if (betAmount > user.balance)
      return enqueueSnackbar("Insufficient balance", { variant: "warning" });

    updateBalance(-betAmount);
    window.dispatchEvent(new Event("balanceUpdated"));

    setBetPlaced(true);
  };

  const startGame = () => {
    setGameStarted(true);
  };

  const handleClick = (value, row, index) => {
    if (!gameStarted) return;
    if (matched.includes(value)) return;

    if (selected.length === 1 && selected[0].row === row) return;
    if (selected.length === 2) return;

    const newSel = [...selected, { value, row, index }];
    setSelected(newSel);

    if (newSel.length === 2) {
      setAttempts((prev) => prev - 1);

      const [a, b] = newSel;
      const isMatch = a.value === b.value;

      if (isMatch) {
        setMatched((prev) => [...prev, a.value]);
      }

      setTimeout(() => {
        setSelected([]);

        const updatedMatched = isMatch
          ? [...matched, a.value]
          : matched;

        shuffleAll(updatedMatched);
      }, 600);
    }
  };

  // Win
  useEffect(() => {
    if (matched.length === 5 && gameStarted) {
      const amount = Number(bet) * 3;

      updateBalance(amount);
      window.dispatchEvent(new Event("balanceUpdated"));

      setWinAmount(amount);
      setResultType("win");
      setResultOpen(true);
    }
  }, [matched, gameStarted, bet]);

  // Lose
  useEffect(() => {
    if (attempts === 0 && matched.length < 5 && gameStarted) {
      setResultType("lose");
      setResultOpen(true);
    }
  }, [attempts, matched.length, gameStarted]);

  const resetGame = () => {
    const { row1, row2 } = generateGame();

    setRow1(row1);
    setRow2(row2);
    setMatched([]);
    setSelected([]);
    setAttempts(20);
    setGameStarted(false);
    setBetPlaced(false);
    setBet("");
  };

  const isOpen = (row, index) => {
    return (
      selected.some((s) => s.row === row && s.index === index) ||
      matched.some((m) =>
        row === "row1"
          ? row1[index] === m
          : row === "row2"
          ? row2[index] === m
          : false
      )
    );
  };

  const shuffleAll = (matchedList) => {
    setRow1((prev) => shuffleUnmatched(prev, matchedList));
    setRow2((prev) => shuffleUnmatched(prev, matchedList));
  };

  return (
    <div className={styles.container}>
      {!gameStarted && <Wallet />}

      {!gameStarted && (
        <Typography
          sx={{
            fontWeight: 600,
            animation: "pulse 2s infinite",
            "@keyframes pulse": {
              "0%": { transform: "scale(1)" },
              "50%": { transform: "scale(1.08)" },
              "100%": { transform: "scale(1)" }
            },
            marginTop: "2rem",
            letterSpacing: "0.05rem"
          }}
        >
          Choose a bet amount to start playing.
        </Typography>
      )}

      {!gameStarted && (
        <div className={styles.betBox}>
          {!betPlaced ? (
            <>
              <input
                className={styles.input}
                type="number"
                placeholder="Enter Bet"
                value={bet}
                onChange={(e) => setBet(e.target.value)}
              />
              <button className={styles.button} onClick={placeBet}>
                Add Bet
              </button>
            </>
          ) : (
            <>
              <h3>Bet Amount: ₹{bet}</h3>
              <button className={styles.button} onClick={startGame}>
                Start Game
              </button>
            </>
          )}
        </div>
      )}

      {gameStarted && (
        <div>
          <Typography variant="body1" sx={{mb: 2}}>
            <span style={{ fontWeight: 600 }}>How to play:</span>{" "}
            Pick one card from each row and match all pairs to win.
          </Typography>

          <Typography variant="h5" className={styles.attempts}>
            Matches left: {attempts}/20
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: { xs: "center", sm: "flex-end" },
              mb: 2
            }}
          >
            <Button
              variant="outlined"
              onClick={() => {
                setResultType("lose");
                setResultOpen(true);
              }}
              sx={{
                color: "#ff4d4d",
                borderColor: "#ff4d4d",
                "&:hover": {
                  borderColor: "#ff4d4d",
                  background: "rgba(255,0,0,0.1)"
                },
                marginRight: "3rem"
              }}
            >
              Quit Game
            </Button>
          </Box>

          <Box sx={rowStyle}>
            {row1.map((n, i) => {
              const open = isOpen("row1", i);

              return (
                <Box
                  key={i}
                  className={styles.cardWrapper}
                  sx={{
                    width: { xs: 80, sm: 100, md: 120 },
                    height: { xs: 100, sm: 130, md: 150 }
                  }}
                  onClick={() => handleClick(n, "row1", i)}
                >
                  <div className={`${styles.cardInner} ${open ? styles.flip : ""}`}>
                    <div className={`${styles.cardFace} ${styles.front}`}>
                      <Typography>?</Typography>
                    </div>

                    <div className={`${styles.cardFace} ${styles.back}`}>
                      <Typography sx={{ fontSize: 20, fontWeight: 600 }}>
                        {n}
                      </Typography>
                    </div>
                  </div>
                </Box>
              );
            })}
          </Box>

          <Box sx={rowStyle}>
            {row2.map((n, i) => {
              const open = isOpen("row2", i);

              return (
                <Box
                  key={i}
                  className={styles.cardWrapper}
                  sx={{
                    width: { xs: 80, sm: 100, md: 120 },
                    height: { xs: 100, sm: 130, md: 150 }
                  }}
                  onClick={() => handleClick(n, "row2", i)}
                >
                  <div className={`${styles.cardInner} ${open ? styles.flip : ""}`}>
                    <div className={`${styles.cardFace} ${styles.front}`}>
                      <Typography>?</Typography>
                    </div>

                    <div className={`${styles.cardFace} ${styles.back}`}>
                      <Typography sx={{ fontSize: 20, fontWeight: 600 }}>
                        {n}
                      </Typography>
                    </div>
                  </div>
                </Box>
              );
            })}
          </Box>
        </div>
      )}

      <ResultModal
        open={resultOpen}
        type={resultType}
        amount={winAmount}
        onClose={() => {
          setResultOpen(false);
          resetGame();
        }}
      />
    </div>
  );
};

export default Game;