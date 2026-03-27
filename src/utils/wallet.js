import { getUsers, saveUsers, getCurrentUser, setCurrentUser } from "./storage";

export const updateBalance = (amount) => {
  let users = getUsers();
  let current = getCurrentUser();

  const updatedUsers = users.map(user => {
    if (user.username === current.username) {
      user.balance += amount;
      current.balance = user.balance;
    }
    return user;
  });

  saveUsers(updatedUsers);
  setCurrentUser(current);
};