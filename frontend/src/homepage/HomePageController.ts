import Transaction from "../common/Classes/Transaction";
import User from "../common/Classes/User";
import PageController from "../common/Interfaces/PageController";
import Chart from 'chart.js/auto'

export default class HomePageController implements PageController {
    public run(user: User): void {
        console.log(user);
        let chartId;
        let YearchartId;
        const transactions = user.getAllTransactions();
        console.log(transactions);
        const categories = user.getCategories();
        let categoryData = {};
        // category summarization
        for(let i=0;i<categories.length;i++){
            categoryData[`${categories[i]}`] = (transactions.map(transaction=>{
                if(transaction.getCategory().toString() === categories[i]){
                    // console.log(transaction)
                    console.log(new Date(transaction.getCreationDate()).getFullYear())
                    return +transaction.amount;
                }
                return 0;
            })).reduce((sum,a)=>sum+a,0);
        } 
        console.log(categoryData)
        const x = Object.keys(categoryData); 
        const y = Object.values(categoryData); 
        // Add recent transactions
        window.onload = ()=>{
            const month = document.getElementById("monthly-summary-date");
            const year = document.getElementById("year").value;
            const total = document.getElementById("total");
            const expensesNumber = document.getElementById("noexpenses")
            const incomeSpan = document.getElementById("income")
            const expensesSpan = document.getElementById("expenses")
            const expensesNumberValue = (transactions.map(transaction=>{
                if(transaction.getType() === "income") return +transaction.amount
                else return -1 * +transaction.amount;
            })).reduce((sum,a)=>sum+a,0);
            const totalIncome = (transactions.map(transaction=>{
                if(transaction.getType() === "income") return +transaction.amount
                return 0;
            })).reduce((sum,a)=>sum+a,0);
            const totalExpenses = (transactions.map(transaction=>{
                if(transaction.getType() === "expense") return +transaction.amount * -1
                return 0;
            })).reduce((sum,a)=>sum+a,0);
            console.log(totalIncome)
            console.log(totalExpenses)
            incomeSpan.innerHTML = `${totalIncome}`
            expensesSpan.innerHTML = `${totalExpenses}`
            total.innerHTML = `${expensesNumberValue}`;
            expensesNumber.innerHTML = `${transactions.length}`;
            console.log(expensesNumberValue)
            setAnnualSummary(year);
            let m = ""
            let d = ""
            let y = new Date().getFullYear().toString();
            if(new Date().getMonth() < 9){
                m = "0" + (new Date().getMonth()+1).toString()
            }else m = (new Date().getMonth()+1).toString()
            if(new Date().getDate() < 10)
                d = "0" + new Date().getDate().toString()
            else d = new Date().getDate().toString()
            
            console.log(y+ "-" + m + "-" + d);
            month.value = y + "-" + m + "-" + d;

            console.log("month",month)
            setMonthlySummary(new Date());
            let recent = [];
            if(transactions.length > 10)
                recent = transactions.splice(transactions.length-10);
            else recent = [...transactions];
            const recentContainer = document.getElementById("my-transactions");
            console.log(recent)
            for(let i=0;i<recent.length;i++){
                const transaction = document.createElement("div");
                const name = document.createElement("div");
                const amount = document.createElement("div");
                name.innerHTML = recent[i].getName();
                if(recent[i].getType() === "income"){
                    amount.style.color = "rgb(20, 232, 20)"
                    amount.innerHTML = "+" + recent[i].getAmount().toString();
                }else{
                    amount.style.color = "red"
                    amount.innerHTML = "-" + recent[i].getAmount().toString();
                }
                transaction.appendChild(name)
                transaction.appendChild(amount)
                transaction.classList.add("transaction");
                recentContainer.appendChild(transaction)
            }
        }
        const setMonthlySummary = (date: Date)=>{
            if(chartId) chartId.destroy()
            let monthlySummary = {};
            console.log("date",date)
            console.log("date mm",date.getMonth())
            transactions.filter(transaction=>new Date(transaction.getCreationDate()).getMonth());
            for(let category of categories){
                const catTransactions = transactions.filter(transaction=>transaction.getCategory().toString() === category);
                const dateTransactions = catTransactions.filter(transaction=>new Date(transaction.getCreationDate()).getFullYear() === date.getFullYear() && 
                new Date(transaction.getCreationDate()).getMonth() === date.getMonth())
                monthlySummary[`${category}`] = (dateTransactions.map(transaction=>+transaction.amount)).reduce((sum,a)=> sum+a ,0);
            }
            console.log("ms",monthlySummary)
            const x = Object.keys(monthlySummary); 
            const y = Object.values(monthlySummary); 
            const barChart = new Chart("bar-chart",{
                type:"bar",
                data: {
                    labels: x,
                    datasets:[{
                        barThickness: 70,
                        backgroundColor: "#007bff",
                        data: y,
                    }]
                },
                options: {
                    plugins:{
                        legend: {display: false},
                        title: {
                            display: true,
                            text: "Monthly Summary"
                        },
                    },
                    scales: {
                        x: {
                          border: {
                            display: true
                          },
                          grid: {
                            display: false,
                            drawOnChartArea: true,
                            drawTicks: true,
                          }
                        },
                        y: {
                          border: {
                            display: true
                          },
                          grid: {
                            display: true,
                            color: "#e3e3e3"
                          },
                        }
                      }
                  }
            });
            chartId = barChart;
        }
        const setAnnualSummary = (year: string)=>{
            const currYear = document.getElementById("current-year");
            currYear.innerHTML = `${year}`;
            if(YearchartId) YearchartId.destroy()
            const yearTransactions = transactions.filter(transaction=>new Date(transaction.getCreationDate()).getFullYear().toString() === year);
            let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
            let monthlyIncome = [] 
            let monthlyExpense = [] 
            let total = [];
            for(let i=0;i<12;i++){
                const monthIncomes = yearTransactions.filter(transaction=>new Date(transaction.getCreationDate()).getMonth() === i && transaction.getType() === "income");
                const income = (monthIncomes.map(transaction=>+transaction.amount)).reduce((sum,a)=> sum+a,0);
                monthlyIncome.push(income);
                const monthExpenses = yearTransactions.filter(transaction=>new Date(transaction.getCreationDate()).getMonth() === i && transaction.getType() === "expense");
                const expenses = (monthExpenses.map(transaction=>+transaction.amount*-1)).reduce((sum,a)=> sum+a,0);
                monthlyExpense.push(expenses);
                total.push(income + expenses);
            }
            const line = new Chart("line-chart",{
                type:"line",
                data: {
                    labels: months,
                    datasets:[
                    {
                        label: "Incomes",
                        borderColor: "#0ac30a",
                        backgroundColor: "rgba(10, 195, 10, 0.1)",
                        data: monthlyIncome,
                        // fill: true
                    },
                    {
                        label: "Expenses",
                        borderColor: "red",
                        backgroundColor: "rgba(255, 0, 0,0.1)",
                        data: monthlyExpense,
                        // fill: true
                    },
                    {
                        label: "Sum",
                        borderColor: "rgb(66, 132, 244)",
                        // backgroundColor: "rgba(66, 132, 244,0.1)",
                        data: total,
                        // fill: true
                    }
                ]
                },
                options: {
                    plugins:{
                        legend: {display: true},
                        title: {
                            display: true,
                            text: "Monthly Summary",
                            font:{
                                size: 16
                            }
                        }
                    }
                  }
            });
            YearchartId = line;
            let income = [];
            let expenses = [];
            const maxArr = transactions.map(transaction=>{
                if(new Date(transaction.getCreationDate()).getFullYear().toString() === year){
                    if(transaction.getType() === "expense"){
                        expenses.push(+transaction.amount)
                        return +transaction.amount;
                    }else{
                        income.push(+transaction.amount)
                        return 0;
                    }
                }
                return 0;
            })
            const maxValue = Math.max(...maxArr)
            const totalIncome = income.reduce((sum,a)=>sum+a,0)
            const totalExpenses = expenses.reduce((sum,a)=>sum+a,0)
            console.log("mx",maxValue)
            document.getElementById("lg-exp-am").innerHTML = `${maxValue}`;
            document.getElementById("total-inc").innerHTML = `${totalIncome}`
            document.getElementById("total-exp").innerHTML = `${totalExpenses}`
            document.getElementById("total-balance").innerHTML = `${totalIncome-totalExpenses}`
        }

        const monthDate = document.getElementById("monthly-summary-date")
        monthDate.onchange = (e:MouseEvent)=>{
            const dateElement = e.target as HTMLInputElement;
            const date = new Date(dateElement.value);
            console.log("aaa",date);
            setMonthlySummary(date)
        }
        const annualDate = document.getElementById("year");
        annualDate.onchange = (e:MouseEvent)=>{
            const yearElement = e.target as HTMLInputElement;
            const year = yearElement.value;
            setAnnualSummary(year)
        }

        const pieChart = new Chart("pie-chart",{
            type:"pie",
            data: {
                labels: x,
                datasets:[{
                    // backgroundColor: color,
                    data: y,
                }]
            },
        });

        const pieChartRecords = new Chart("pie-chart-small",{
            type:"pie",
            data: {
                labels: x,
                datasets:[{
                    // backgroundColor: color,
                    data: y,
                }]
            },
        });
        const barChartRecords = new Chart("bar-chart-small",{
            type:"bar",
            data: {
                labels: x,
                datasets:[{
                    barThickness: 70,
                    backgroundColor: "#007bff",
                    data: y,
                }]
            },
            options: {
                plugins:{
                    legend: {display: false},
                    title: {
                        display: true,
                        text: "Monthly Summary"
                    },
                },
                scales: {
                    x: {
                      border: {
                        display: true
                      },
                      grid: {
                        display: false,
                        drawOnChartArea: true,
                        drawTicks: true,
                      }
                    },
                    y: {
                      border: {
                        display: true
                      },
                      grid: {
                        display: true,
                        color: "#e3e3e3"
                      },
                    }
                  }
              }
        });
        console.log(Chart)
    }
}

