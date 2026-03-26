import { Box } from "@mui/material";
import styles from "../styles/Game.module.css";

const rowStyle = {
  display: "flex",
  justifyContent: "center",
  gap: 2,
  mb: 2,
  flexWrap: "wrap"
};

const GameCards = ({ row, rowName, isOpen, handleClick }) => {
  return (
    <Box sx={rowStyle}>
      {row.map((n, i) => {
        const open = isOpen(rowName, i);

        return (
          <Box
            key={i}
            className={styles.cardWrapper}
            sx={{
  width: { xs: 60, sm: 80, md: 100 },
  height: { xs: 80, sm: 110, md: 130 }
}}
            onClick={() => handleClick(n, rowName, i)}
          >
            <div className={`${styles.cardInner} ${open ? styles.flip : ""}`}>
              <div className={`${styles.cardFace} ${styles.front}`}>?</div>
              <div className={`${styles.cardFace} ${styles.back}`}>{n}</div>
            </div>
          </Box>
        );
      })}
    </Box>
  );
};

export default GameCards;