import { walkUpBindingElementsAndPatterns } from "typescript";
import Transaction from "../common/Classes/Transaction";
import User from "../common/Classes/User";
import PageController from "../common/Interfaces/PageController";
import { TransactionType } from "../common/Classes/Transaction";
import PeriodicTransaction from "../common/Classes/PeriodicTransaction";
import { getDuration } from "../common/main";
import OneTimeTransaction from "../common/Classes/OneTimeTransaction";

export default class DashboardPageController implements PageController {
  private incomeSpan: HTMLSpanElement;
  private expenseSpan: HTMLSpanElement;

  private incomeList: HTMLTableSectionElement;
  private incomeTable: HTMLTableElement;

  private expenseList: HTMLTableSectionElement;
  private expenseTable: HTMLTableElement;

  private periodicInputs: HTMLCollectionOf<HTMLInputElement>

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
    this.fillTransactionTables();
    this.handleSearch();
    this.handleTableClick();
    this.handleClose();
    this.handleSave();
  }

  private init(user: User): void {
    this.user = user;

    this.incomeTable = document.getElementById(
      "income-table"
    ) as HTMLTableElement;
    this.incomeList = document.getElementById(
      "income-list"
    ) as HTMLTableSectionElement;
    this.expenseTable = document.getElementById(
      "expense-list"
    ) as HTMLTableElement
    this.expenseList = document.getElementById(
      "expense-list"
    ) as HTMLTableSectionElement


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
    function clickHandler(event): void {
      const target = event.target as HTMLElement;
      if (target.classList.contains("fa-trash")) {
        this.handleDelete(target.parentElement.parentElement);
      } else if (target.classList.contains("fa-edit")) {
        this.handleEdit(target.parentElement.parentElement);
      }
    }

    this.incomeList.addEventListener("click", clickHandler.bind(this));
    this.expenseList.addEventListener("click", clickHandler.bind(this));
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
      const rows = Array.from(
        this.incomeList.getElementsByTagName("tr")
      ).concat(
        Array.from(this.expenseList.getElementsByTagName("tr"))
      );

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

  public fillTransactionTables(): void {
    let totalIncome = 0;
    let totalExpense = 0;
    this.userTransactions.forEach((transaction, index) => {
      transaction.updateTransaction()

      let row: HTMLTableRowElement
      if (transaction.getType() === "income") {
        row = this.incomeList.insertRow()
        totalIncome += transaction.getAmount();
      } else {
        row = this.expenseList.insertRow()
        totalExpense += transaction.getAmount();
      }

      row.id = transaction.getId();
      row.insertCell().textContent = transaction.getName();
      row.insertCell().textContent = transaction.getAmount() + "";
      row.insertCell().textContent = transaction instanceof PeriodicTransaction ? "Periodic" : "One Time"
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


      if (transaction instanceof PeriodicTransaction) {
        const nExecutions = transaction.getNumberOfExecutions()
        const interval = getDuration(transaction.getInterval())

        const hiddenCell = row.insertCell()
        hiddenCell.classList.add("expanded-row-content")
        hiddenCell.classList.add("hide-row")
        
        hiddenCell.innerHTML= `<h2>More Info</h2>
                              <p>Executed ${nExecutions} times<br>
                              Execution times left ${transaction.getExecutionLimit() - nExecutions}<br>
                              Interval: ${interval.value} ${interval.unit}</p>`

        row.addEventListener("click", () => {
          hiddenCell.classList.toggle("hide-row")
        })
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

    const periodicFields = document.getElementById("periodic-fields");
    this.periodicInputs = periodicFields.getElementsByTagName("input") as HTMLCollectionOf<HTMLInputElement>;  

    // select the transaction to edit
    const transactionId = row.id;
    const transaction = this.userTransactions.find(
      (transaction) => transaction.getId() === transactionId
    );

    if (transaction instanceof OneTimeTransaction) {
      periodicFields.style.display = "none";
      document.getElementById("date-label").innerText = "Payment Date:"
    } else {
      document.getElementById("date-label").innerText = "Start Date:"
      periodicFields.style.display = "block";
      this.periodicInputs[0].valueAsNumber = getDuration((transaction as PeriodicTransaction).getInterval()).value
      this.periodicInputs[1].valueAsNumber = (transaction as PeriodicTransaction).getExecutionLimit()
    }
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

      if (transaction instanceof OneTimeTransaction)
        transaction.setDate(new Date(this.dateInput.value).getTime())
      else if (transaction instanceof PeriodicTransaction) {
        transaction.setStartDate(new Date(this.dateInput.value).getTime())
        transaction.setInterval(this.periodicInputs[0].valueAsNumber * 24 * 60 * 60 * 1000)
        transaction.setExecutionLimit(this.periodicInputs[1].valueAsNumber)
      }
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
      this.updateTransactionRow(oldType, transaction);
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

  public updateTransactionRow(oldType: TransactionType, transaction: Transaction): void {
    const row = document.getElementById(transaction.getId());
    const newType = transaction.getType()

    if (oldType != newType) {
      switch (newType) {
        case "income":
          this.incomeList.appendChild(row)
          break;
        case "expense":
          this.expenseList.appendChild(row)
          break;
      }
    }

    const cells = row.getElementsByTagName("td");
    cells[0].textContent = transaction.getName();
    cells[1].textContent = transaction.getAmount().toString();
    cells[2].textContent = transaction instanceof PeriodicTransaction ? "Periodic" : "One Time"
    cells[3].textContent = transaction
      .getCategory()
      .reduce((prev, current, index, array) => {
        return prev + current + (index < array.length - 1 ? "," : "");
      }, "");

    if (transaction instanceof OneTimeTransaction)
      cells[4].textContent = new Date(transaction.getDate()).toDateString()
    else if (transaction instanceof PeriodicTransaction)
      cells[4].textContent = new Date(transaction.getStartDate()).toDateString()

    if (transaction instanceof PeriodicTransaction) {
      const nExecutions = transaction.getNumberOfExecutions()
      const interval = getDuration(transaction.getInterval())

      cells[6].innerHTML = `<h2>More Info</h2>
                            <p>Executed ${nExecutions} times<br>
                            Execution times left ${transaction.getExecutionLimit() - nExecutions}<br>
                            Interval: ${interval.value} ${interval.unit}</p>`
    }
  }
}
