export const getTransactionId = () => {
  return `tran_${Date.now()}_${Math.ceil(Math.random() * 1000)}`;
};
