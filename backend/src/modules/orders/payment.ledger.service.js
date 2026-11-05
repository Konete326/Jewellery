import { Payment } from './payment.model.js';
import { PaymentAccount } from '../payment-accounts/paymentAccount.model.js';

export async function getBankLedger(bankAccountId) {
  const account = await PaymentAccount.findById(bankAccountId).lean();
  if (!account) {
    const err = new Error('Bank account not found');
    err.statusCode = 404;
    throw err;
  }

  const transactions = await Payment.find({ bankAccount: bankAccountId }).sort({ createdAt: -1 }).lean();
  let receivedAmount = 0, pendingAmount = 0, rejectedAmount = 0;
  let countApproved = 0, countPending = 0, countRejected = 0;

  transactions.forEach((tx) => {
    if (tx.status === 'Approved') {
      receivedAmount += tx.amount;
      countApproved++;
    } else if (tx.status === 'Pending') {
      pendingAmount += tx.amount;
      countPending++;
    } else if (tx.status === 'Rejected') {
      rejectedAmount += tx.amount;
      countRejected++;
    }
  });

  return {
    account,
    summary: {
      receivedAmount,
      pendingAmount,
      rejectedAmount,
      countApproved,
      countPending,
      countRejected,
      totalTransactions: transactions.length
    },
    transactions
  };
}
