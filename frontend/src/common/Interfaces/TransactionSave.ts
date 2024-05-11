import { TransactionType, PaymentMethod } from "../Classes/Transaction";

export interface TransactionBaseSave {
    id: string;
    type: TransactionType;
    paymentMethod: PaymentMethod;
    creationDate: number;
    amount: number;
    category: string[];
    name: string;
    description: string;
    source: string;
    destination: string;
    ended: boolean;
}

export interface OneTimeTransactionSave extends TransactionBaseSave {
    date: number;
}

export interface PeriodicTransactionSave extends TransactionBaseSave {
    startDate: number;
    interval: number;
    executionLimit: number;
    numberOfExecutions: number;
    lastExecutionDate: number;
}