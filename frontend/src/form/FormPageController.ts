import User from "../common/Classes/User";
import OneTimeTransaction from "../common/Classes/OneTimeTransaction";
import PeriodicTransaction from "../common/Classes/PeriodicTransaction";
import PageController from "../common/Interfaces/PageController";
import { PaymentMethod, TransactionType } from "../common/Classes/Transaction";

export default class FormPageController implements PageController {
    private value: string[] = [];
    private user: User
    private chipInput: HTMLInputElement;
    private addChipBtn: HTMLButtonElement;
    private chipsContainer: HTMLElement;
    private logoutButton: HTMLElement;


    constructor() {
        this.chipInput = document.getElementById("chipInput") as HTMLInputElement;
        this.addChipBtn = document.getElementById("addChipBtn") as HTMLButtonElement;
        this.chipsContainer = document.getElementById("chipsContainer") as HTMLElement;
        this.logoutButton = document.getElementById("logoutButton");
    }
    public run(user: User): void {

        this.user = user
        const submitButton = document.getElementById('submit-button') as HTMLButtonElement;
        const transactionPeriodSelect = document.getElementById('transactionPeriod') as HTMLSelectElement;
        const typeSelect = document.getElementById('type') as HTMLSelectElement;

        transactionPeriodSelect.value = 'once';
        typeSelect.value = 'expense';

        this.handleTypeChange(null);
        this.handleTransactionPeriodChange();
        this.addChipBtn.addEventListener("click", (event) => this.addChip(event));
        submitButton.addEventListener('click', (event) => this.handleSubmit(event, this.user));
        transactionPeriodSelect.addEventListener('change', () => this.handleTransactionPeriodChange());
        typeSelect.addEventListener('change', (event) => this.handleTypeChange(event));
    }
    private addChip(event): void {
        event.preventDefault();
        const chipText = this.chipInput.value.trim();
        if (chipText) {
            this.value.push(chipText);
            this.renderChips();
            this.chipInput.value = "";
        }
    }

    private removeChip(text: string): void {
        const index = this.value.indexOf(text);
        if (index !== -1) {
            this.value.splice(index, 1);
            this.renderChips();
        }
    }

    private renderChips(): void {
        this.chipsContainer.innerHTML = "";
        this.value.forEach(text => {
            this.addChipElement(text);
        });
    }

    private addChipElement(text: string): void {
        // Create chip container
        const chip = document.createElement("div");
        chip.classList.add("bg-gray-200", "rounded", "px-3", "py-1", "text-sm", "text-gray-700", "flex", "items-center", "mb-2", "mr-2","h-10");

        // Create chip text
        const chipText = document.createElement("span");
        chipText.textContent = text;

        //  close button
        const chipCloseBtn = document.createElement("button");
        chipCloseBtn.innerHTML = "&times;";
        chipCloseBtn.classList.add("ml-2", "text-gray-500", "hover:text-gray-700", "focus:outline-none", "text-sm");

        // Style
        chipCloseBtn.addEventListener("mouseenter", () => {
            chipCloseBtn.classList.replace("text-gray-500", "text-red-500");
        });

        chipCloseBtn.addEventListener("mouseleave", () => {
            chipCloseBtn.classList.replace("text-red-500", "text-gray-500");
        });

        // Add click event to remove chip
        chipCloseBtn.addEventListener("click", () => {
            this.removeChip(text);
        });

        // Append chip text and close button to chip container
        chip.appendChild(chipText);
        chip.appendChild(chipCloseBtn);

        // Append chip container to chips container
        this.chipsContainer.appendChild(chip);
    }

    handleTransactionPeriodChange() {
        const transactionPeriodSelect = document.getElementById('transactionPeriod') as HTMLSelectElement;
        const dateFields = document.getElementById('dateFields') as HTMLElement;
        const periodicFields = document.getElementById('periodicFields') as HTMLElement;
        if (transactionPeriodSelect.value === 'once') {
            dateFields.style.display = 'block';
            periodicFields.style.display = 'none';
        } else if (transactionPeriodSelect.value === 'periodic') {
            dateFields.style.display = 'none';
            periodicFields.style.display = 'block';
        } else {
            dateFields.style.display = 'none';
            periodicFields.style.display = 'none';
        }
    }

    handleTypeChange(event) {
        const typeSelect = document.getElementById('type') as HTMLSelectElement;
        const sourceField = document.getElementById('sourceField') as HTMLElement;
        const destinationField = document.getElementById('destinationField') as HTMLElement;
        const sourceInput = document.getElementById('source') as HTMLInputElement;
        const destinationInput = document.getElementById('destination') as HTMLInputElement;

        if (typeSelect.value === 'expense') {
            sourceInput.value = 'Me';
            sourceField.style.display = 'none';
            destinationInput.value = '';
            destinationField.style.display = 'block';
        } else if (typeSelect.value === 'income') {
            sourceInput.value = '';
            sourceField.style.display = 'block';
            destinationInput.value = 'Me';
            destinationField.style.display = 'none';
        }
    }

    handleSubmit(event: Event, user: User) {
        event.preventDefault();

        const warningMessage = document.getElementById('warning') as HTMLParagraphElement;
        const transactionPeriodSelect = document.getElementById('transactionPeriod') as HTMLSelectElement;
        const nameInput = document.getElementById('name') as HTMLInputElement;
        const typeSelect = document.getElementById('type') as HTMLSelectElement;
        const paymentSelect = document.getElementById('paymentMethod') as HTMLSelectElement;
        const amountInput = document.getElementById('amount') as HTMLInputElement;
        const descriptionInput = document.getElementById('description') as HTMLInputElement;
        const sourceInput = document.getElementById('source') as HTMLInputElement;
        const destinationInput = document.getElementById('destination') as HTMLInputElement;

        let categories = this.value;
        let newCategories = categories.filter(category => !user.getCategories().includes(category))
        newCategories.forEach(category => user.addCategory(category));

        const transaction: any = {
            name: nameInput.value,
            type: typeSelect.value as TransactionType,
            paymentMethod: paymentSelect.value as PaymentMethod,
            amount: parseFloat(amountInput.value),
            category: categories,
            description: descriptionInput.value,
            source: sourceInput.value,
            destination: destinationInput.value,
        };


        if (transactionPeriodSelect.value === 'once') {
            const dateInput = document.getElementById('date') as HTMLInputElement;
            transaction.date = dateInput.valueAsNumber;

        } else if (transactionPeriodSelect.value === 'periodic') {
            const startDateInput = document.getElementById('startDate') as HTMLInputElement;
            const intervalInput = document.getElementById('interval') as HTMLInputElement;
            const executionLimitInput = document.getElementById('executionLimit') as HTMLInputElement;

            transaction.startDate = startDateInput.valueAsNumber;
            const days = parseInt(intervalInput.value);
            const millisecondsInDay = 24 * 60 * 60 * 1000;
            transaction.interval = days * millisecondsInDay;
            transaction.executionLimit = parseInt(executionLimitInput.value);
        }

        let msg = this.validateTransaction(transaction, transactionPeriodSelect.value)
        if (msg !== null) {
            warningMessage.textContent = "Incorrect: " +msg;
            warningMessage.style.visibility = 'visible';
            return;
        }

        let transactionObj: OneTimeTransaction | PeriodicTransaction;
        if (transactionPeriodSelect.value === 'once') {
            transactionObj = OneTimeTransaction.create(user, transaction)
        } else if (transactionPeriodSelect.value === 'periodic') {
            transactionObj = PeriodicTransaction.create(user, transaction)
        }

        user.addTransaction(transactionObj);

        window.location.href = "./dashboard.html"
    }

    validateTransaction(transaction: any, transactionPeriod: string): string | null {
        if (transaction.name.trim() === '') {
            return 'Name cannot be empty';
        }
        if (!transaction.amount || isNaN(transaction.amount) || transaction.amount <= 0) {
            return 'Amount must be a positive number';
        }
        if (transactionPeriod === 'once') {
            if (!transaction.date || isNaN(transaction.date)) {
                return 'Date is required for one-time transaction';
            }
        } else if (transactionPeriod === 'periodic') {
            if (!transaction.startDate || isNaN(transaction.startDate)) {
                return 'Start date is required for periodic transaction';
            }
            if (!transaction.interval || isNaN(transaction.interval) || transaction.interval <= 0) {
                return 'Interval must be a positive number';
            }
            if (isNaN(transaction.executionLimit) || transaction.executionLimit <= 0) {
                return 'Execution limit must be a positive number';
            }
        }

        return null;
    }

}
