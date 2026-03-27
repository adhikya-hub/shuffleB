import { useEffect, useState } from "react";
import { Button, Box, Typography } from "@mui/material";
import { generateGame, shuffleUnmatched } from "../utils/game";
import { updateBalance } from "../utils/wallet";
import { getCurrentUser } from "../utils/storage";
import Wallet from "./Wallet";
import styles from "../styles/Game.module.css";
import { useSnackbar } from "notistack";
import ResultModal from "./ResultModal";
import GameCards from "./GameCards";

/* Constants */
const MAX_ATTEMPTS = 20;
const MAX_BET = 5000;
const FLIP_DURATION = 600;
const SHUFFLE_DELAY = 5000;
const SINGLE_SELECT_DELAY = 3000;

const Game = () => {
  const [row1, setRow1] = useState([]);
  const [row2, setRow2] = useState([]);

  const [selected, setSelected] = useState([]);
  const [matched, setMatched] = useState([]);

  const [bet, setBet] = useState("");
  const [betPlaced, setBetPlaced] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [attempts, setAttempts] = useState(MAX_ATTEMPTS);

  const [resultOpen, setResultOpen] = useState(false);
  const [resultType, setResultType] = useState("");
  const [winAmount, setWinAmount] = useState(0);

  const { enqueueSnackbar } = useSnackbar();

  /* Start Game */
  useEffect(() => {
    const { row1, row2 } = generateGame();
    setRow1(row1);
    setRow2(row2);
  }, []);

  /* Shuffle helper */
  const shuffleUnmatchedCards = (matchedList) => {
    setRow1((prev) => shuffleUnmatched(prev, matchedList));
    setRow2((prev) => shuffleUnmatched(prev, matchedList));
  };

  /* Auto Shuffle when idle (no selection) */
  useEffect(() => {
    if (!gameStarted) return;
    if (selected.length !== 0) return;

    const timeout = setTimeout(() => {
      shuffleUnmatchedCards(matched);
    }, SHUFFLE_DELAY);

    return () => clearTimeout(timeout);
  }, [selected, matched, gameStarted]);

  /* Shuffle when ONE card selected and user inactive */
  useEffect(() => {
    if (!gameStarted) return;
    if (selected.length !== 1) return;

    const timeout = setTimeout(() => {
      // flip back 
      setSelected([]);

      // then shuffle AFTER flip animation
      setTimeout(() => {
        shuffleUnmatchedCards(matched);
      }, 200);
    }, SINGLE_SELECT_DELAY);

    return () => clearTimeout(timeout);
  }, [selected, matched, gameStarted]);

  /* Card Click Logic */
  const handleCardClick = (value, row, index) => {
    if (!gameStarted) return;
    if (matched.includes(value)) return;

    const isSameRowSelection =
      selected.length === 1 && selected[0].row === row;

    const isSameCardSelected = selected.some(
      (item) => item.row === row && item.index === index
    );

    const alreadyTwoSelected = selected.length === 2;

    if (isSameRowSelection || isSameCardSelected || alreadyTwoSelected) return;

    const updatedSelection = [...selected, { value, row, index }];
    setSelected(updatedSelection);

    if (updatedSelection.length === 2) {
      setAttempts((prev) => prev - 1);

      const [first, second] = updatedSelection;
      const isMatch = first.value === second.value;

      if (isMatch) {
        setMatched((prev) => [...prev, first.value]);
      }

      setTimeout(() => {
        // flip back 
        setSelected([]);

        if (!isMatch) {
          // shuffle after flip animation finishes
          setTimeout(() => {
            setMatched((prevMatched) => {
              shuffleUnmatchedCards(prevMatched);
              return prevMatched;
            });
          }, 200);
        }
      }, FLIP_DURATION);
    }
  };

  /* Win Logic */
  useEffect(() => {
    const allMatched = matched.length === 5;

    if (allMatched && gameStarted) {
      const amount = Number(bet) * 3;

      updateBalance(amount);
      window.dispatchEvent(new Event("balanceUpdated"));

      setWinAmount(amount);
      setResultType("win");
      setResultOpen(true);
    }
  }, [matched, gameStarted, bet]);

  /* Lose Logic */
  useEffect(() => {
    const isGameLost = attempts === 0 && matched.length < 5;

    if (isGameLost && gameStarted) {
      setResultType("lose");
      setResultOpen(true);
    }
  }, [attempts, matched, gameStarted]);

  /* Reset Game */
  const resetGame = () => {
    const { row1, row2 } = generateGame();

    setRow1(row1);
    setRow2(row2);
    setMatched([]);
    setSelected([]);
    setAttempts(MAX_ATTEMPTS);

    setGameStarted(false);
    setBetPlaced(false);
    setBet("");
  };

  /* Card Open Logic */
  const isCardOpen = (row, index) => {
    const isSelected = selected.some(
      (item) => item.row === row && item.index === index
    );

    const isMatched = matched.some((value) =>
      row === "row1"
        ? row1[index] === value
        : row2[index] === value
    );

    return isSelected || isMatched;
  };

  /* Place Bet */
  const handlePlaceBet = () => {
    const betAmount = Number(bet);

    if (!betAmount || betAmount <= 0) {
      return enqueueSnackbar("Enter valid bet", { variant: "warning" });
    }

    if (betAmount > MAX_BET) {
      return enqueueSnackbar(`Max bet ₹${MAX_BET}`, {
        variant: "warning",
      });
    }

    const user = getCurrentUser();

    if (betAmount > user.balance) {
      return enqueueSnackbar("Insufficient balance", {
        variant: "warning",
      });
    }

    updateBalance(-betAmount);
    window.dispatchEvent(new Event("balanceUpdated"));

    setBetPlaced(true);
  };

  const handleStartGame = () => {
    setGameStarted(true);
  };

  return (
    <div className={styles.container}>
      {!gameStarted && <Wallet />}

      {!gameStarted && (
        <Typography className={styles.pulseText}>
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
              <button
                className={styles.button}
                onClick={handlePlaceBet}
                disabled={!bet}
              >
                Add Bet
              </button>
            </>
          ) : (
            <>
              <h3>Bet Amount: ₹{bet}</h3>
              <button
                className={styles.button}
                onClick={handleStartGame}
              >
                Start Game
              </button>
            </>
          )}
        </div>
      )}

      {gameStarted && (
        <>
          <Typography sx={{ mb: 2 }}>
            Pick one card from each row and match all pairs.
          </Typography>

          <Typography variant="h5" className={styles.attempts}>
            Matches left: {attempts}/{MAX_ATTEMPTS}
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: { xs: "center", sm: "flex-end" },
              mb: 2,
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
              }}
            >
              Quit Game
            </Button>
          </Box>

          <GameCards
            row={row1}
            rowName="row1"
            isOpen={isCardOpen}
            handleClick={handleCardClick}
          />

          <GameCards
            row={row2}
            rowName="row2"
            isOpen={isCardOpen}
            handleClick={handleCardClick}
          />
        </>
      )}

      <ResultModal
        open={resultOpen}
        type={resultType}
        amount={winAmount}
        bet={bet}
        onClose={() => {
          setResultOpen(false);
          resetGame();
        }}
      />
    </div>
  );
};

export default Game;