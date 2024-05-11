import { OneTimeTransactionSave, TransactionBaseSave } from "../Interfaces/TransactionSave";
import Transaction, { PaymentMethod, TransactionType } from "./Transaction";
import User from "./User";

export default class OneTimeTransaction extends Transaction {
    private date: number;

    public getDate() {
        return this.date;
    }

    public setDate(date: number) {
        this.date = date;
        this.save();
    }

    public updateTransaction(): void {
        if (this.ended) {
            return;
        }

        if (this.date < Date.now()) {
            super.applyTransaction();
            this.ended = true;
        }
    }

    private constructor(user: User) {
        super(user);
    }

    public static load(owner: User, props: OneTimeTransactionSave): OneTimeTransaction {
        const transaction = new OneTimeTransaction(owner);
        transaction.load(props);
        transaction.date = props.date;
        transaction.updateTransaction();
        return transaction;
    }
    
    public toJSON(): OneTimeTransactionSave {
        return {
            ...super.toJSON(),
            date: this.date,
        };
    }

    public static create(owner: User, props: {
        name: string;
        type: TransactionType;
        paymentMethod: PaymentMethod;
        amount: number;
        date: number;
      }): OneTimeTransaction {
        const trans = new OneTimeTransaction(owner);
        trans.name = props.name;
        trans.type = props.type;
        trans.paymentMethod = props.paymentMethod;
        trans.amount = props.amount;
        trans.date = props.date;
        return trans;
    }
}