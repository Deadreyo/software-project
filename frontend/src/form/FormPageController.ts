import User from "../common/Classes/User";
import OneTimeTransaction from "../common/Classes/OneTimeTransaction";
import PeriodicTransaction from "../common/Classes/PeriodicTransaction";
import PageController from "../common/Interfaces/PageController";
import { PaymentMethod, TransactionType } from "../common/Classes/Transaction";

export default class FormPageController implements PageController {

    public run(user: User): void {
        const form = document.getElementById('paymentForm') as HTMLFormElement;
        const transactionPeriodSelect = document.getElementById('transactionPeriod') as HTMLSelectElement;
        const typeSelect = document.getElementById('type') as HTMLSelectElement;

        transactionPeriodSelect.value = 'once';
        typeSelect.value = 'expense';

        this.handleTypeChange();
        this.handleTransactionPeriodChange();

        form.addEventListener('submit', (event) => this.handleSubmit(event, user));
        transactionPeriodSelect.addEventListener('change', () => this.handleTransactionPeriodChange());
        typeSelect.addEventListener('change', () => this.handleTypeChange());
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

    handleTypeChange() {
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
        const categoryInput = document.getElementById('category') as HTMLInputElement;
        const descriptionInput = document.getElementById('description') as HTMLInputElement;
        const sourceInput = document.getElementById('source') as HTMLInputElement;
        const destinationInput = document.getElementById('destination') as HTMLInputElement;

        let categories = categoryInput.value.split(",").map((item: string) => item.trim());
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
            transaction.interval = parseInt(intervalInput.value);
            transaction.executionLimit = parseInt(executionLimitInput.value);
        }

        let msg = this.validateTransaction(transaction, transactionPeriodSelect.value)
        if (msg !== null) {
            warningMessage.textContent = msg;
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

        // Reset form fields after submission (Uncomment later for ease of use)
        // (document.getElementById('paymentForm') as HTMLFormElement).reset();
        this.handleTransactionPeriodChange(); // To reset visibility of fields
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