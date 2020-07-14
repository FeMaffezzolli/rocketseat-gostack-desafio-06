import csvParse from 'csv-parse';
import fs from 'fs';
import Transaction from '../models/Transaction';
import AppError from '../errors/AppError';

import CreateTransactionService from './CreateTransactionService';

interface Request {
  filePath: string;
}

class ImportTransactionsService {
  async execute({ filePath }: Request): Promise<Transaction[]> {
    const data = await this.loadCSV(filePath);

    if (!data || !data.length) {
      throw new AppError('Invalid data');
    }

    const createTransaction = new CreateTransactionService();

    const transactions = [];

    // eslint-disable-next-line no-plusplus
    for (let index = 0; index < data.length; index++) {
      const [title, type, value, category] = data[index];

      // eslint-disable-next-line no-await-in-loop
      const transaction = await createTransaction.execute({
        title,
        type,
        value,
        category,
      });

      transactions.push(transaction);
    }

    return transactions;
  }

  async loadCSV(
    filePath: string,
  ): Promise<[string, 'income' | 'outcome', number, string][]> {
    const readCSVStream = fs.createReadStream(filePath);

    const parseStream = csvParse({
      from_line: 2,
      ltrim: true,
      rtrim: true,
    });

    const parseCSV = readCSVStream.pipe(parseStream);

    const lines: Array<[string, 'income' | 'outcome', number, string]> = [];

    parseCSV.on('data', line => {
      lines.push(line);
    });

    await new Promise(resolve => {
      parseCSV.on('end', resolve);
    });

    return lines;
  }
}

export default ImportTransactionsService;
