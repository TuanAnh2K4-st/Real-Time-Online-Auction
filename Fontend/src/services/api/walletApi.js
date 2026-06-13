import axiosClient from "../axiosClient";

export const getMyWallet = () => {
  return axiosClient.get("/wallet/me");
};

export const getWalletTransactions = (page = 0, size = 50) => {
  return axiosClient.get(`/wallet/transactions?page=${page}&size=${size}`);
};

export const depositWallet = (amount) => {
  return axiosClient.post("/wallet/deposit", { amount });
};

export const withdrawWallet = ({ amount, bankCode, accountNumber }) => {
  return axiosClient.post("/wallet/withdraw", {
    amount,
    bankCode,
    accountNumber,
  });
};
