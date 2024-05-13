import { walkUpBindingElementsAndPatterns } from "typescript";
import Transaction from "../common/Classes/Transaction";
import User from "../common/Classes/User";
import PageController from "../common/Interfaces/PageController";

export default class DashboardPageController implements PageController {
  // private totalSpentSpan: HTMLElement
  // private totalIncomeSpan: HTMLElement
  // private addPaymentButton: HTMLButtonElement
  private incomeSpan: HTMLSpanElement;
  private expenseSpan: HTMLSpanElement;
  private transactionList: HTMLTableSectionElement;
  private transactionsTable: HTMLTableElement;
  private user: User;
  private userTransactions: Array<Transaction>;

  public run(user: User): void {
    this.init(user);
    this.fillTransactionTable();
    this.handleSearch();
    this.handleTableClick();
  }

  private init(user: User): void {
    // this.addPaymentButton = document.getElementById("add-payment") as HTMLButtonElement
    // this.addPaymentButton.addEventListener("click", this.handleAddPayment)
    // this.totalSpentSpan = document.getElementById("spent-amount")
    // this.totalIncomeSpan = document.getElementById("income-amount")
    // const totalSpent = this.userTransactions.reduce((prev, current) => {
    //   if (current.getType() === "expense") return prev + current.getAmount();

    //   return prev + 0;
    // }, 0);
    // const totalIncome = this.userTransactions.reduce((prev, current) => {
    //   if (current.getType() === "income") return prev + current.getAmount();

    //   return prev + 0;
    // }, 0);

    // this.totalSpentSpan.textContent = totalSpent + ""
    // this.totalIncomeSpan.textContent = totalIncome + ""

    this.user = user;

    this.transactionsTable = document.getElementById(
      "trans-table"
    ) as HTMLTableElement;

    this.transactionList = document.getElementById(
      "transaction-list"
    ) as HTMLTableSectionElement;

    this.incomeSpan = document.getElementById("income-amount");

    this.expenseSpan = document.getElementById("expense-amount");

    this.userTransactions = this.user.getAllTransactions();
  }

  public handleTableClick(): void {
    this.transactionList.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;
      if (target.classList.contains("fa-trash")) {
        this.handleDelete(target.parentElement.parentElement);
      } else if (target.classList.contains("fa-edit")) {
        this.handleEdit(target.parentElement.parentElement);
      }
    });
  }

  public handleDelete(row: HTMLElement): void {
    const transactionId = row.id;
    const transaction = this.userTransactions.find(
      (transaction) => transaction.getId() === transactionId
    );
    this.user.removeTransaction(transaction);
    row.remove();

    let totalIncome = parseFloat(this.incomeSpan.textContent);
    let totalExpense = parseFloat(this.expenseSpan.textContent);
    const cells = row.getElementsByTagName("td");
    const amountCellValue = parseFloat(cells[1].textContent);
    const typeCellValue = cells[2].textContent.toLowerCase();

    if (typeCellValue === "income") {
      totalIncome -= amountCellValue;
    } else {
      totalExpense -= amountCellValue;
    }

    this.updateIncomeAndExpense(totalIncome, totalExpense);
  }

  public handleEdit(row: HTMLElement): void {}

  public handleExpand(row: HTMLElement): void {}

  public handleSearch(): void {
    const searchBar = document.getElementById("search-bar") as HTMLInputElement;
    searchBar.addEventListener("keyup", (event) => {
      const rows = this.transactionsTable.getElementsByTagName("tr");
      const searchValue = searchBar.value.trim().toLowerCase();
      let totalIncome = 0;
      let totalExpense = 0;

      for (let i = 1; i < rows.length; i++) {
        rows[i].style.display = "none";
        const cells = rows[i].getElementsByTagName("td");
        const nameCellValue = cells[0].textContent.toLowerCase();
        const amountCellValue = parseFloat(cells[1].textContent);
        const typeCellValue = cells[2].textContent.toLowerCase();
        const categoryCellValue = cells[3].textContent.toLowerCase();

        if (
          nameCellValue.includes(searchValue) ||
          categoryCellValue.includes(searchValue)
        ) {
          rows[i].style.display = "";
          if (typeCellValue === "income") {
            totalIncome += amountCellValue;
          } else {
            totalExpense += amountCellValue;
          }
        }
      }

      this.updateIncomeAndExpense(totalIncome, totalExpense);
    });
  }

  public handleAddPayment(): void {
    window.location.href = "./form.html";
  }

  public fillTransactionTable(): void {
    let totalIncome = 0;
    let totalExpense = 0;
    this.userTransactions.forEach((transaction) => {
      const row = this.transactionList.insertRow();
      row.id = transaction.getId();
      row.insertCell().textContent = transaction.getName();
      row.insertCell().textContent = transaction.getAmount() + "";
      row.insertCell().textContent = transaction.getType();
      row.insertCell().textContent = transaction
        .getCategory()
        .reduce((prev, current) => {
          return prev + current + ",";
        }, "");
      row.insertCell().textContent = new Date(
        transaction.getCreationDate()
      ).toDateString();

      row.insertCell().innerHTML = `<i class="fas fa-edit"></i>
                                    <i class="fas fa-trash"></i>`;

      if (transaction.getType() === "income") {
        totalIncome += transaction.getAmount();
      } else {
        totalExpense += transaction.getAmount();
      }
    });

    this.updateIncomeAndExpense(totalIncome, totalExpense);
  }

  public updateIncomeAndExpense(income: number, expense: number): void {
    this.incomeSpan.textContent = income.toFixed(2).toString();
    this.expenseSpan.textContent = expense.toFixed(2).toString();
  }
}
