import { TransactionBaseSave } from "../Interfaces/TransactionSave";
import User from "./User";

export type TransactionType = "income" | "expense";
export type PaymentMethod = "cash" | "visa";

export default abstract class Transaction {
  private id: string = crypto.randomUUID();
  protected type: TransactionType;
  protected paymentMethod: PaymentMethod;
  private creationDate: number = Date.now();
  protected owner: User;
  protected amount: number;
  protected category: string[] = [];
  protected name: string;
  protected description: string = "";
  protected source: string = "";
  protected destination: string = "";
  protected ended: boolean = false;

  public getId() {
    return this.id;
  }

  public getType() {
    return this.type;
  }

  public getPaymentMethod() {
    return this.paymentMethod;
  }

  public getCreationDate() {
    return this.creationDate;
  }

  public isEnded() {
    return this.ended;
  }

  public getAmount() {
    return this.amount;
  }

  public setAmount(amount: number) {
    this.amount = amount;
    this.save();
  }

  public getCategory() {
    return this.category;
  }

  public setCategory(category: string[]) {
    this.category = category;
    this.save();
  }

  public getName() {
    return this.name;
  }

  public setName(name: string) {
    this.name = name;
    this.save();
  }

  public getDescription() {
    return this.description;
  }

  public setDescription(description: string) {
    this.description = description;
    this.save();
  }

  public getSource() {
    return this.source;
  }

  public setSource(source: string) {
    this.source = source;
    this.save();
  }

  public getDestination() {
    return this.destination;
  }

  public setDestination(destination: string) {
    this.destination = destination;
    this.save();
  }

  protected constructor(user: User) {
    this.owner = user;
  }

  protected load(props: TransactionBaseSave) {
    this.id = props.id;
    this.name = props.name;
    this.type = props.type;
    this.paymentMethod = props.paymentMethod;
    this.amount = props.amount;
    this.ended = props.ended;
    this.category = props.category;
    this.description = props.description;
    this.source = props.source;
    this.destination = props.destination;
    this.creationDate = props.creationDate;
  }

  public toJSON(): TransactionBaseSave {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      paymentMethod: this.paymentMethod,
      amount: this.amount,
      ended: this.ended,
      category: this.category,
      description: this.description,
      source: this.source,
      destination: this.destination,
      creationDate: this.creationDate,
    };
  }

  protected applyTransaction() {
    if (this.type === "income") {
      this.owner.setBalance(this.owner.getBalance() + this.amount);
    } else {
      this.owner.setBalance(this.owner.getBalance() - this.amount);
    }
  }

  abstract updateTransaction(): void;

  protected async save() {
    await this.owner.save();
  }
}
