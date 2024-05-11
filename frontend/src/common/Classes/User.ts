import { OneTimeTransactionSave, PeriodicTransactionSave } from "../Interfaces/TransactionSave";
import UserSave from "../Interfaces/UserSave";
import LoginController from "../LoginController";
import OneTimeTransaction from "./OneTimeTransaction";
import PeriodicTransaction from "./PeriodicTransaction";
import Transaction from "./Transaction";

export default class User {
    private email: string;
    private isPro: boolean = false;
    private balance: number = 0;
    private categories: string[] = [];
    private loginController: LoginController;
    private transactions: Transaction[] = [];

    public getEmail() {
        return this.email;
    }

    public getIsPro() {
        return this.isPro;
    }

    public getBalance() {
        return this.balance;
    }

    public setBalance(balance: number) {
        this.balance = balance;
        this.save();
    }

    public getCategories() {
        return this.categories;
    }

    public addCategory(category: string) {
        this.categories.push(category);
        this.save();
    }

    public getAllTransactions() {
        return this.transactions;
    }

    public addTransaction(transaction: Transaction) {
        this.transactions.push(transaction);
        this.save();
    }

    public removeTransaction(transaction: Transaction) {
        this.transactions = this.transactions.filter(t => t !== transaction);
        this.save();
    }

    public async save() {
        await this.loginController.saveUser();
    }

    private constructor(loginController: LoginController) {
        this.loginController = loginController;
    }

    public toJSON(): UserSave {
        return {
            email: this.email,
            isPro: this.isPro,
            balance: this.balance,
            categories: this.categories,
            transactions: this.transactions.map(t => t.toJSON()),
        };
    }

    /**
     * Constructor for loading a user from the database
     */
    static load (loginController: LoginController, props: UserSave): User {
        const user = new User(loginController);
        user.email = props.email;
        user.isPro = props.isPro;
        user.balance = props.balance;
        user.categories = props.categories;
        user.transactions = props.transactions.map(t => {
            if ('interval' in t) {
                return PeriodicTransaction.load(user, t as PeriodicTransactionSave);
            } else {
                return OneTimeTransaction.load(user, t as OneTimeTransactionSave);
            }
        });
        return user;
    }

    /**
     * Constructor for creating a new user
     */
    static create(loginController: LoginController, email: string) {
        const user = new User(loginController);
        user.email = email;
        return user;
    }

}