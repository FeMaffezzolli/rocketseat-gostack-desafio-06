import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const allTransactions = await this.find();

    const income = allTransactions.reduce((acc, current) => {
      if (current.type === 'income') {
        return acc + parseFloat(current.value);
      }
      return acc;
    }, 0);

    const outcome = allTransactions.reduce((acc, current) => {
      if (current.type === 'outcome') {
        return acc + parseFloat(current.value);
      }
      return acc;
    }, 0);

    const total = income - outcome;

    return { total, income, outcome };
  }
}

export default TransactionsRepository;
