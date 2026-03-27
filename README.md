# ShuffleB – Betting Card Matching Game

## 🔗 Live Demo

- Main Application: https://shuffleb-nu.vercel.app/  
- Admin Panel: https://shuffleb-nu.vercel.app/admin  

Note: Please log in to access the Admin page. In this demo, all users can access the admin panel.

---

## Project Overview

ShuffleB is an interactive betting-based card matching game built using React.js.  
Users can place bets, match card pairs, and earn rewards based on their performance.

The application simulates a full-stack system using frontend-only logic, focusing on user experience, game mechanics, and state management.

---

## Key Features

### Authentication
- User Signup & Login
- Credentials stored securely in localStorage
- Session persistence across refresh

---

### Wallet System
- Each user has a wallet balance
- Add money functionality
- Bet amount is deducted before gameplay
- Winnings are added automatically

---

### Betting System
- Minimum bet > ₹0
- Maximum bet ₹5000
- Winning = 3 × bet amount
- Losing or quitting = bet lost

---

### Game Mechanics
- 2 rows × 5 cards each
- Same numbers in both rows, shuffled differently
- Select 1 card from each row to match

#### Anti-Cheat Logic
- Cards reshuffle dynamically after moves
- Timer-based reshuffling every 5 seconds
- Prevents memorization of positions

#### Rules
- Match → cards stay open  
- No match → cards flip back  
- Match all pairs → win  
- Limited attempts (20)

---

### Admin Panel
- View all users
- Search users
- Sort users:
  - Balance (ascending/descending)
  - Alphabetical
- Edit user balance
- Add new users
- Delete users
- View total users & total balance

---

## Tech Stack

- **React.js** – Frontend framework  
- **Material UI (MUI)** – UI components  
- **CSS Modules** – Styling  
- **localStorage** – Simulated database  
- **notistack** – Notifications  

---

## How to Run Locally

```bash
git clone https://github.com/adhikya-hub/shuffleB.git
cd betting-game
npm install
npm start
```

---

## Notes

This project is implemented as a frontend-only application using localStorage to simulate backend functionality.






