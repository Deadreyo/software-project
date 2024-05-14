import { walkUpBindingElementsAndPatterns } from "typescript";
import Transaction from "../common/Classes/Transaction";
import User from "../common/Classes/User";
import PageController from "../common/Interfaces/PageController";
import { TransactionType } from "../common/Classes/Transaction";

export default class DashboardPageController implements PageController {
  private incomeSpan: HTMLSpanElement;
  private expenseSpan: HTMLSpanElement;
  private transactionList: HTMLTableSectionElement;
  private transactionsTable: HTMLTableElement;
  private user: User;
  private userTransactions: Array<Transaction>;
  private closeBtn: HTMLButtonElement;
  private saveBtn: HTMLButtonElement;
  private editFromModal: HTMLDivElement;
  private nameInput: HTMLInputElement;
  private amountInput: HTMLInputElement;
  private typeSelect: HTMLSelectElement;
  private categoryInput: HTMLInputElement;
  private dateInput: HTMLInputElement;
  private selectedTransactionId: string;

  public run(user: User): void {
    this.init(user);
    this.fillTransactionTable();
    this.handleSearch();
    this.handleTableClick();
    this.handleClose();
    this.handleSave();
  }

  private init(user: User): void {
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

    this.closeBtn = document.getElementById("close-btn") as HTMLButtonElement;

    this.saveBtn = document.getElementById("save-btn") as HTMLButtonElement;

    this.editFromModal = document.getElementById(
      "editFormModal"
    ) as HTMLDivElement;
    this.nameInput = document.getElementById("editName") as HTMLInputElement;

    this.amountInput = document.getElementById(
      "editAmount"
    ) as HTMLInputElement;

    this.typeSelect = document.getElementById("editType") as HTMLSelectElement;

    this.categoryInput = document.getElementById(
      "editCategory"
    ) as HTMLInputElement;

    this.dateInput = document.getElementById("editDate") as HTMLInputElement;
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
        .reduce((prev, current, index, array) => {
          return prev + current + (index < array.length - 1 ? "," : "");
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

  public handleEdit(row: HTMLElement): void {
    this.editFromModal.style.display = "block";

    // select the transaction to edit
    const transactionId = row.id;
    const transaction = this.userTransactions.find(
      (transaction) => transaction.getId() === transactionId
    );

    // populate the form with the transaction data
    this.selectedTransactionId = transactionId;
    this.nameInput.value = transaction.getName();
    this.amountInput.value = transaction.getAmount().toString();
    this.typeSelect.value = transaction.getType();
    this.categoryInput.value = transaction.getCategory().join(", ");
    this.dateInput.value = this.formatDateFromTimestamp(
      transaction.getCreationDate()
    );
  }

  public handleSave(): void {
    this.saveBtn.addEventListener("click", () => {
      // select the transaction to save
      const transaction = this.userTransactions.find(
        (transaction) => transaction.getId() === this.selectedTransactionId
      );

      let oldAmount = transaction.getAmount();
      let oldType = transaction.getType();
      let totalIncome = parseFloat(this.incomeSpan.textContent);
      let totalExpense = parseFloat(this.expenseSpan.textContent);

      // update the transaction
      transaction.setName(this.nameInput.value);
      transaction.setAmount(parseFloat(this.amountInput.value));
      transaction.setCategory(this.categoryInput.value.split(","));
      transaction.setType(this.typeSelect.value as TransactionType);
      transaction.setCreationDate(new Date(this.dateInput.value).getTime());

      // update the total income and expense if the amount has changed or the type has changed or both
      if (oldType == transaction.getType()) {
        if (transaction.getType() === "income") {
          totalIncome += transaction.getAmount() - oldAmount;
        } else {
          totalExpense += transaction.getAmount() - oldAmount;
        }
      }

      if (oldType != transaction.getType()) {
        if (transaction.getType() === "income") {
          totalIncome += transaction.getAmount();
          totalExpense -= oldAmount;
        } else {
          totalExpense += transaction.getAmount();
          totalIncome -= oldAmount;
        }
      }

      this.updateIncomeAndExpense(totalIncome, totalExpense);
      this.updateTransactionRow(transaction);
      this.editFromModal.style.display = "none";
    });
  }

  public handleClose(): void {
    this.closeBtn.addEventListener("click", () => {
      this.editFromModal.style.display = "none";
    });
  }

  public formatDateFromTimestamp(timestamp: number): string {
    const date = new Date(timestamp);
    return date.toISOString().split("T")[0];
  }

  public updateTransactionRow(transaction: Transaction): void {
    const row = document.getElementById(transaction.getId());
    const cells = row.getElementsByTagName("td");
    cells[0].textContent = transaction.getName();
    cells[1].textContent = transaction.getAmount().toString();
    cells[2].textContent = transaction.getType();
    cells[3].textContent = transaction
      .getCategory()
      .reduce((prev, current, index, array) => {
        return prev + current + (index < array.length - 1 ? "," : "");
      }, "");
    cells[4].textContent = new Date(
      transaction.getCreationDate()
    ).toDateString();
  }
}
