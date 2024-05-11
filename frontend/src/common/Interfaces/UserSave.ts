import { OneTimeTransactionSave, PeriodicTransactionSave, TransactionBaseSave } from "./TransactionSave";

export default interface UserSave {
    email: string;
    isPro: boolean;
    balance: number;
    categories: string[];
    transactions: TransactionBaseSave[];
}