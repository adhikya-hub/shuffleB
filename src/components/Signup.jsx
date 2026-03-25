import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUsers, saveUsers } from "../utils/storage";
import { useSnackbar } from "notistack";
import styles from "../styles/Auth.module.css";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleSignup = () => {
    if (!email || !password) {
      return enqueueSnackbar("All fields are required", { variant: "warning" });
    }

    if (password.length < 8) {
      return enqueueSnackbar(
        "Password must be at least 8 characters",
        { variant: "warning" }
      );
    }

    let users = getUsers();

    const exists = users.find((u) => u.email === email);
    if (exists) {
      return enqueueSnackbar("User already exists", { variant: "error" });
    }

    const newUser = { email, password, balance: 1000 };

    users.push(newUser);
    saveUsers(users);

    enqueueSnackbar("Signup successful 🎉", { variant: "success" });

    setTimeout(() => {
      navigate("/login");
    }, 800);
  };

  return (
    <div className={styles.container}>
      
      {/* 🔥 LEFT SIDE (Branding) */}
      <div className={styles.left}>
        <div className={styles.brand}>
          <div className={styles.logo}>ShuffleB</div>

          <div className={styles.tagline}>
            Play smart. Match faster. Win bigger.
          </div>

          <div className={styles.description}>
            Join ShuffleB and experience a dynamic card game where strategy and
            quick thinking make all the difference. Place your bets, track the
            cards, and find matching pairs before the board reshuffles. Stay
            focused, every move could be your winning move.
          </div>
        </div>
      </div>

      {/* 🔥 RIGHT SIDE (Signup Card) */}
      <div className={styles.right}>
        <div className={styles.card}>
          <h2 className={styles.title}>Create Account</h2>

          <input
            className={styles.input}
            placeholder="Username"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className={styles.input}
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className={styles.button} onClick={handleSignup}>
            Signup
          </button>

          <p className={styles.link}>
            Already a user?{" "}
            <span onClick={() => navigate("/login")}>Login</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;