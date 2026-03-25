import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUsers, setCurrentUser } from "../utils/storage";
import { useSnackbar } from "notistack";
import styles from "../styles/Auth.module.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleLogin = () => {
    if (!email || !password) {
      return enqueueSnackbar("Please fill all fields", { variant: "warning" });
    }

    const users = getUsers();

    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      return enqueueSnackbar("Invalid email or password", {
        variant: "error",
      });
    }

    setCurrentUser(user);

    enqueueSnackbar("Login successful 🎉", { variant: "success" });

    setTimeout(() => {
      navigate("/game");
    }, 800);
  };

  return (
    <div className={styles.container}>
      
      {/* 🔥 LEFT SIDE (Branding) */}
      <div className={styles.left}>
        <div className={styles.brand}>
          <div className={styles.logo}>ShuffleB</div>

          <div className={styles.tagline}>
            Smart shuffle. Smarter wins.
          </div>

          <div className={styles.description}>
            Step into a fast-moving card challenge where memory, timing, and
            smart decisions shape the outcome. Place your bet, track the numbers,
            and uncover matching pairs before the board changes again. Every move
            counts, and hesitation can cost you the win.
          </div>
        </div>
      </div>

      {/* 🔥 RIGHT SIDE (Login Card) */}
      <div className={styles.right}>
        <div className={styles.card}>
          <h2 className={styles.title}>Welcome Back</h2>

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

          <button className={styles.button} onClick={handleLogin}>
            Login
          </button>

          <p className={styles.link}>
            New user?{" "}
            <span onClick={() => navigate("/")}>Signup</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;