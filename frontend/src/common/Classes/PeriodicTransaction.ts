import { PeriodicTransactionSave } from "../Interfaces/TransactionSave";
import Transaction, { PaymentMethod, TransactionType } from "./Transaction";
import User from "./User";

export default class PeriodicTransaction extends Transaction {
  private startDate: number;
  private interval: number;
  private lastExecutionDate: number | null = null;
  private numberOfExecutions: number = 0;
  private executionLimit: number = Number.MAX_SAFE_INTEGER;

  public getStartDate() {
    return this.startDate;
  }

  public getInterval() {
    return this.interval;
  }

  public getLastExecutionDate() {
    return this.lastExecutionDate;
  }

  public getNumberOfExecutions() {
    return this.numberOfExecutions;
  }

  public getExecutionLimit() {
    return this.executionLimit;
  }

  public setInterval(interval: number) {
    this.interval = interval;
    this.save();
  }

  public setExecutionLimit(executionLimit: number) {
    this.executionLimit = executionLimit;
    this.save();
  }

  public updateTransaction(): void {
    if (this.ended) {
      return;
    }

    while (this.lastExecutionDate + this.interval < Date.now()) {
      super.applyTransaction();
      this.lastExecutionDate += this.interval;
      this.numberOfExecutions++;
      if (this.numberOfExecutions >= this.executionLimit) {
        this.ended = true;
        break;
      }
    }
  }

  private constructor(user: User) {
    super(user);
  }

  public static load (owner: User, props: PeriodicTransactionSave): PeriodicTransaction {
    const transaction = new PeriodicTransaction(owner);
    transaction.load(props);
    transaction.startDate = props.startDate;
    transaction.interval = props.interval;
    transaction.lastExecutionDate = props.lastExecutionDate || null;
    transaction.numberOfExecutions = props.numberOfExecutions || 0;
    transaction.executionLimit = props.executionLimit || Number.MAX_SAFE_INTEGER;
    transaction.updateTransaction();
    return transaction;
  }

  public toJSON(): PeriodicTransactionSave {
    return {
      ...super.toJSON(),
      startDate: this.startDate,
      interval: this.interval,
      lastExecutionDate: this.lastExecutionDate,
      numberOfExecutions: this.numberOfExecutions,
      executionLimit: this.executionLimit,
    };
  }

  public static create(owner: User, props: {
    name: string;
    type: TransactionType;
    paymentMethod: PaymentMethod;
    amount: number;
    startDate: number;
    interval: number;
    executionLimit?: number;
  }): PeriodicTransaction {
    const trans = new PeriodicTransaction(owner);
    trans.name = props.name;
    trans.type = props.type;
    trans.paymentMethod = props.paymentMethod;
    trans.amount = props.amount;
    trans.startDate = props.startDate;
    trans.interval = props.interval;
    trans.executionLimit = props.executionLimit || Number.MAX_SAFE_INTEGER;
    return trans;
  }
}
