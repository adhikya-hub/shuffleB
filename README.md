# ShuffleB – Betting Card Matching Game

ShuffleB is a responsive betting card game where players combine memory, strategy, and timing to win rewards. Users place bets, match card pairs across two rows, and earn payouts based on successful matches, all within a dynamic, anti-cheat environment.

---

## Project Overview

This project simulates a full-stack application using only the frontend. It includes authentication, wallet management, game logic, and an admin panel, all powered by React and localStorage.

The goal is to deliver a realistic gaming experience, while maintaining fair gameplay and clean architecture.

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

### Betting System
- Minimum bet > ₹0
- Maximum bet ₹5000
- Winning = 3 × bet amount
- Losing or quitting = bet lost

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


