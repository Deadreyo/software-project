import { walkUpBindingElementsAndPatterns } from "typescript";
import Transaction from "../common/Classes/Transaction";
import User from "../common/Classes/User";
import PageController from "../common/Interfaces/PageController";

export default class DashboardPageController implements PageController {
  private totalSpentSpan: HTMLElement
  private totalIncomeSpan: HTMLElement
  private addPaymentButton: HTMLButtonElement

  private transactionsTable: HTMLTableElement
  private user: User
  private userTransactions: Array<Transaction>

  public run(user: User): void {
    this.user = user
    
    this.addPaymentButton = document.getElementById("add-payment") as HTMLButtonElement
    this.addPaymentButton.addEventListener("click", this.handleAddPayment)

    this.transactionsTable = document.getElementById("trans-table") as HTMLTableElement
    this.totalSpentSpan = document.getElementById("spent-amount")
    this.totalIncomeSpan = document.getElementById("income-amount")

    this.userTransactions = this.user.getAllTransactions()
    const totalSpent = this.userTransactions.reduce((prev, current) => {
      if (current.getType() === "expense")
        return prev + current.getAmount()

      return prev + 0
    }, 0)
    const totalIncome = this.userTransactions.reduce((prev, current) => {
      if (current.getType() === "income")
        return prev + current.getAmount()

      return prev + 0
    }, 0)

    this.totalSpentSpan.textContent = totalSpent + ""
    this.totalIncomeSpan.textContent = totalIncome + ""
    this.fillTransactionTable()
  }

  public handleDelete(): void {}

  public handleEdit(): void {}

  public handleExpand(): void {}

  public search(): void {}

  public handleAddPayment(): void {
    window.location.href = "./form.html"
  }

  public fillTransactionTable(): void {
    this.userTransactions.forEach((transaction, index) => {
      const row = this.transactionsTable.insertRow()

      row.insertCell().textContent = transaction.getName()
      row.insertCell().textContent = transaction.getAmount() + ""
      row.insertCell().textContent = transaction.getType()
      row.insertCell().textContent = transaction.getCategory().reduce((prev, current) => {
        return prev + current + ","
      }, "")
      row.insertCell().textContent = new Date(transaction.getCreationDate()).toDateString()
    })
  }
}
