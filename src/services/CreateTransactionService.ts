import { getCustomRepository, getRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';

import Category from '../models/Category';

import Transaction from '../models/Transaction';

interface Request {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    type,
    value,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionsRepository);

    if (type === 'outcome') {
      const { total } = await transactionRepository.getBalance();

      if (value > total) {
        throw new AppError('Balance is insuficient.');
      }
    }

    const categoryRepository = getRepository(Category);

    let categoryInstance = await categoryRepository.findOne({
      where: { title: category },
    });

    if (!categoryInstance) {
      categoryInstance = await categoryRepository.save({ title: category });
    }

    const transaction = await transactionRepository.save({
      title,
      type,
      value,
      category_id: categoryInstance,
    });

    return transaction;
  }
}

export default CreateTransactionService;
