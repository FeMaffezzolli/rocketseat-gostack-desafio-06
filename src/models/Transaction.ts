import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

import Category from './Category';

@Entity('transactions')
class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  title: string;

  @Column('varchar')
  type: 'income' | 'outcome';

  @Column('decimal')
  value: number;

  @ManyToOne(() => Category, category => category.transactions)
  category: Category;

  @Column('timestamp with time zone', { default: 'now()' })
  created_at: Date;

  @Column('timestamp with time zone', { default: 'now()' })
  updated_at: Date;
}

export default Transaction;
