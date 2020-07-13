import { Router } from 'express';
import { getCustomRepository, getRepository } from 'typeorm';

import Category from '../models/Category';

import TransactionsRepository from '../repositories/TransactionsRepository';
// import CreateTransactionService from '../services/CreateTransactionService';
// import DeleteTransactionService from '../services/DeleteTransactionService';
// import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  const transactionRepository = getCustomRepository(TransactionsRepository);

  const transactions = await transactionRepository.find({
    relations: ['category'],
  });

  return response.json(transactions);
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category: categoryTitle } = request.body;

  const categoryRepository = getRepository(Category);

  let category = await categoryRepository.findOne({
    where: { title: categoryTitle },
  });

  if (!category) {
    category = await categoryRepository.save({ title: categoryTitle });
  }

  const transactionRepository = getCustomRepository(TransactionsRepository);

  const transaction = await transactionRepository.save({
    title,
    type,
    value,
    category,
  });

  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  // TODO
});

transactionsRouter.post('/import', async (request, response) => {
  // TODO
});

export default transactionsRouter;
