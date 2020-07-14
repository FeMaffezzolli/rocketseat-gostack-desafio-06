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

    const transactions: Promise<Transaction[]> = Promise.all(
      data.map(entry => {
        const [title, type, value, category] = entry;

        return createTransaction.execute({
          title,
          type,
          value,
          category,
        });
      }),
    );

    return transactions;
  }

  async loadCSV(filePath: string): any[] {
    const readCSVStream = fs.createReadStream(filePath);

    const parseStream = csvParse({
      from_line: 2,
      ltrim: true,
      rtrim: true,
    });

    const parseCSV = readCSVStream.pipe(parseStream);

    const lines = [];

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
