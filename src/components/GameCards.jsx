import { Box } from "@mui/material";
import styles from "../styles/Game.module.css";

const rowContainerStyle = {
  display: "flex",
  justifyContent: "center",
  gap: 2,
  mb: 2,
  flexWrap: "wrap",
};

const GameCards = ({ row, rowName, isOpen, handleClick }) => {
  return (
    <Box sx={rowContainerStyle}>
      {row.map((value, index) => {
        const isCardVisible = isOpen(rowName, index);

        return (
          <Box
            key={`${rowName}-${index}`}
            className={styles.cardWrapper}
            sx={{
              width: { xs: 50, sm: 80, md: 100 },
              height: { xs: 80, sm: 110, md: 130 },
              cursor: "pointer",
            }}
            onClick={() => handleClick(value, rowName, index)}
          >
            <div
              className={`${styles.cardInner} ${
                isCardVisible ? styles.flip : ""
              }`}
            >
              {/* Front */}
              <div className={`${styles.cardFace} ${styles.front}`}>
                ?
              </div>

              {/* Back */}
              <div className={`${styles.cardFace} ${styles.back}`}>
                {value}
              </div>
            </div>
          </Box>
        );
      })}
    </Box>
  );
};

export default GameCards;