# Expense Tracker Application

The Expense Tracker Application is a web-based tool designed to help users keep track of their expenses, manage transactions, and analyze spending patterns. The application is built using Node.js and MongoDB at the backend, with TypeScript used instead of JavaScript for improved type safety and developer experience. Below is an overview of the main pages included in the project:

## 1. Homepage (`homepage.html`)

The homepage serves as the main interface of the Expense Tracker Application. It provides users with an overview of their financial data and various tools for expense management and analysis. Key features of the homepage include:

- General information section displaying statistics such as the number of transactions, total income/expenses, and upcoming payment details.
- Graphs section presenting visual representations of expense categories and monthly summaries.
- Transaction history section showing recent transactions and past 30-day records.
- Navigation menu for easy access to other pages within the application.

## 2. Transaction Form (`form.html`)

The transaction form page allows users to input new expenses or income data into the system. It provides a user-friendly interface with input fields for specifying transaction details such as name, type, amount, category, description, and date. Key features of the transaction form include:

- Options to specify transaction type (income or expense) and payment method.
- Automatic calculation of transaction intervals for periodic transactions.
- Validation checks to ensure all required fields are filled out correctly before submission.

## 3. Dashboard (`dashboard.html`)

The dashboard page offers users a comprehensive view of their financial data through interactive charts and graphs. It provides insights into spending patterns, category summaries, and monthly trends. Key features of the dashboard include:

- Pie chart and bar chart visualizations for category summaries and monthly expense trends.
- Line chart displaying monthly income and expense rates over time.
- Dropdown menu for selecting specific months and years for data analysis.

## 4. Login Page (`login.html`)

The login page allows users to securely access their accounts by entering their credentials. It provides a simple form for users to input their username and password, with options for account registration and password recovery. Key features of the login page include:

- Input fields for username and password authentication.
- Links for registering a new account or resetting the password if forgotten.
- Error messages for invalid login attempts or missing credentials.

## Project Structure

The project follows a modular structure with separate HTML, CSS, and TypeScript files for each page. Additionally, it includes a `static` directory containing bundled TypeScript files and external dependencies. The `style` directory contains global and page-specific CSS files for styling the application.

## Usage

To use the Expense Tracker Application, simply open the `homepage.html` file in a web browser. From there, you can navigate to different pages using the provided links in the navigation menu. To add new transactions, access the transaction form page (`form.html`) and fill out the required fields. For a more detailed analysis of your financial data, explore the dashboard (`dashboard.html`) for interactive charts and graphs.

## Installation

To run the Expense Tracker Application locally, follow these steps:

### Prerequisites

- Node.js installed on your machine. You can download it from [nodejs.org](https://nodejs.org/).
- MongoDB installed and running as a service. You can download it from [mongodb.com](https://www.mongodb.com/).

### Backend Setup

1. Clone the repository to your local machine:

   ```bash
   https://github.com/Deadreyo/software-project.git
2. Navigate to the project directory:

```bash
cd backend
```
3. Install dependencies:

```bash
npm install
```
4. Set up environment variables by creating a .env file in the backend directory and adding the following variables:

```bach
PORT=3000
MONGODB_URI=mongodb://localhost:27017/backend
```
 Replace mongodb://localhost:27017/backend r with your MongoDB connection URI if necessary.

5. Start the backend server:

```bash

npm start
```
### Frontend Setup
1. Navigate to the frontend directory:

``` bash

cd ../frontend
```
2. Install dependencies:

``` bash
npm install
```
3. Start the development server:

``` bash

npm start
```
Open your web browser and visit http://localhost:8080 to access the Expense Tracker Application.
