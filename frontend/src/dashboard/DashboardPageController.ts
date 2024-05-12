import OneTimeTransaction from "../common/Classes/OneTimeTransaction";
import Transaction from "../common/Classes/Transaction";
import User from "../common/Classes/User";
import PageController from "../common/Interfaces/PageController";

export default class DashboardPageController implements PageController {
  private amountSpentSpan: HTMLElement
  private transactionsTable: HTMLTableElement
  private user: User
  private userTransactions: Array<Transaction>

  public run(user: User): void {
    this.user = user
    
    this.transactionsTable = <HTMLTableElement>document.getElementById("trans-table")
    this.amountSpentSpan = document.getElementById("amount");
    this.createDummyPayments()

    this.userTransactions = this.user.getAllTransactions()
    const totalSpent =this.userTransactions.reduce((prev, current) => {
      return prev + current.getAmount()
    }, 0)

    this.amountSpentSpan.textContent = totalSpent + ""
    this.fillTransactionTable()
  }

  public createDummyPayments(): void {
    for (let i = 0; i < 10; i++) {
      OneTimeTransaction.create(
        this.user,
        {
          name: "hey",
          type: "income",
          paymentMethod: "visa",
          amount: Math.floor(Math.random() * (1000 - 100 + 1) + 100),
          date: 12
        }
      )
    }
  }

  public handleDelete(): void {}

  public handleEdit(): void {}

  public handleExpand(): void {}

  public search(): void {}

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
