import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

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

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id', referencedColumnName: 'id' })
  category: Category;

  @Column('uuid')
  category_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Transaction;
