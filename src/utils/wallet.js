import { getUsers, saveUsers, getCurrentUser, setCurrentUser } from "./storage";

export const updateBalance = (amount) => {
  let users = getUsers();
  let current = getCurrentUser();

  const updatedUsers = users.map(u => {
    if (u.email === current.email) {
      u.balance += amount;
      current.balance = u.balance;
    }
    return u;
  });

  saveUsers(updatedUsers);
  setCurrentUser(current);
};