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
                    console.log(new Date(transaction.date).getFullYear())
                    return +transaction.getAmount();
                }
                return 0;
            })).reduce((sum,a)=>sum+a,0);
        } 
        console.log(categoryData)
        const x = Object.keys(categoryData); 
        const y = Object.values(categoryData); 
        // Add recent transactions
        window.onload = ()=>{
            setMonthlySummary(new Date());
            const month = document.getElementById("monthly-summary-date");
            // const year = document.getElementById("year").value;
            const total = document.getElementById("total");
            const expensesNumber = document.getElementById("noexpenses")
            const incomeSpan = document.getElementById("income")
            const expensesSpan = document.getElementById("expenses")
            const expensesNumberValue = (transactions.map(transaction=>{
                if(transaction.getType() === "income") return +transaction.getAmount()
                else return -1 * +transaction.getAmount();
            })).reduce((sum,a)=>sum+a,0);
            const totalIncome = (transactions.map(transaction=>{
                if(transaction.getType() === "income") return +transaction.getAmount()
                return 0;
            })).reduce((sum,a)=>sum+a,0);
            const totalExpenses = (transactions.map(transaction=>{
                if(transaction.getType() === "expense") return +transaction.getAmount() * -1
                return 0;
            })).reduce((sum,a)=>sum+a,0);
            console.log(totalIncome)
            console.log(totalExpenses)
            incomeSpan.innerHTML = `${totalIncome}`
            expensesSpan.innerHTML = `${totalExpenses}`
            total.innerHTML = `${expensesNumberValue}`;
            expensesNumber.innerHTML = `${transactions.length}`;
            console.log(expensesNumberValue)
            setAnnualSummary("2024");
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
            
            let recent = [];
            if(transactions.length > 10)
                recent = transactions.slice(transactions.length-10);
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

            // past 30 days records
            let maxValue = 0
            let maxValueName = ""
            let expenses = [];
            let Expenses = 0
            let incomes = 0
            const past30Transactions = transactions.filter(transaction=>(Date.now() - transaction.date) <= 30*24*60*60*1000);
            past30Transactions.forEach(transaction=>{
                if(transaction.getType() === "expense"){
                    expenses.push(+transaction.getAmount())
                    Expenses += transaction.getAmount()
                    if(+transaction.getAmount() > maxValue){
                        maxValue = +transaction.getAmount();
                        maxValueName = transaction.getName();
                    }
                }else{
                    incomes+= +transaction.getAmount();
                }
            })
            let past30cat = []
            for(let i =0;i<categories.length;i++){
                past30cat[i] = past30Transactions.filter(transaction=>transaction.getCategory().toString() === categories[i]).map(transaction=>+transaction.getAmount()).reduce((sum,a)=>sum+a,0)
            }
            document.getElementById("past30name").innerHTML =`${maxValueName}`
            document.getElementById("past30value").innerHTML = `${maxValue}`
            document.getElementById("past30income").innerHTML = `+${incomes}`
            document.getElementById("past30expenses").innerHTML = `-${Expenses}`
            const pieChartRecords = new Chart("pie-chart-small",{
                type:"pie",
                data: {
                    labels: categories,
                    datasets:[{
                        // backgroundColor: color,
                        data: past30cat,
                    }]
                },
            });
            console.log(past30Transactions)
        }
        const setMonthlySummary = (date: Date)=>{
            if(chartId) chartId.destroy()
            let monthlySummary = {};
            console.log("date",date)
            console.log("date mm",date.getMonth())
            transactions.filter(transaction=>new Date(transaction.date).getMonth());
            for(let category of categories){
                const catTransactions = transactions.filter(transaction=>transaction.getCategory().toString() === category);
                const dateTransactions = catTransactions.filter(transaction=>new Date(transaction.date).getFullYear() === date.getFullYear() && 
                new Date(transaction.date).getMonth() === date.getMonth())
                monthlySummary[`${category}`] = (dateTransactions.map(transaction=>+transaction.getAmount())).reduce((sum,a)=> sum+a ,0);
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
            const yearTransactions = transactions.filter(transaction=>new Date(transaction.date).getFullYear().toString() === year);
            let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
            let monthlyIncome = [] 
            let monthlyExpense = [] 
            let total = [];
            console.log("months[0]",transactions[8].date)
            for(let i=0;i<12;i++){
                const monthIncomes = yearTransactions.filter(transaction=>new Date(transaction.date).getMonth() === i && transaction.getType() === "income");
                const income = (monthIncomes.map(transaction=>+transaction.getAmount())).reduce((sum,a)=> sum+a,0);
                monthlyIncome.push(income);
                console.log(months[i],income)
                const monthExpenses = yearTransactions.filter(transaction=>new Date(transaction.date).getMonth() === i && transaction.getType() === "expense");
                const expenses = (monthExpenses.map(transaction=>+transaction.getAmount()*-1)).reduce((sum,a)=> sum+a,0);
                monthlyExpense.push(expenses);
                total.push(income + expenses);
            }
            console.log("mx",monthlyIncome)
            console.log(monthlyExpense)
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
            let ms = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            let income = [];
            let expenses = [];
            let maxExpense = [0,0];
            let minExpense = [0,1000000000000000];
            let maxExpenseName = ""
            const maxArr = transactions.map(transaction=>{
                if(new Date(transaction.date).getFullYear().toString() === year){
                    if(transaction.getType() === "expense"){
                        expenses.push(+transaction.getAmount())
                        if(+transaction.getAmount() > maxExpense[1]){
                            maxExpense[1] = +transaction.getAmount();
                            maxExpenseName = transaction.getName();
                        }
                        return +transaction.getAmount();
                    }else{
                        income.push(+transaction.getAmount())
                        return 0;
                    }
                }
                return 0;
            })

            for(let i=0;i<12;i++){
                const monthExpenses = transactions.filter(transaction=>new Date(transaction.date).getFullYear().toString() === year 
                && new Date(transaction.date).getMonth() === i).map(transaction=>transaction.getType() === "expense"? +transaction.getAmount():0).reduce((sum,a)=>sum+a,0);
                if(monthExpenses > maxExpense[1]){
                    maxExpense[0] = i;
                    maxExpense[1] = monthExpenses;
                }
                if(monthExpenses < minExpense[1]){
                    minExpense[0] = i;
                    minExpense[1] = monthExpenses;
                }

            }


            const maxValue = Math.max(...maxArr)
            const totalIncome = income.reduce((sum,a)=>sum+a,0)
            const totalExpenses = expenses.reduce((sum,a)=>sum+a,0)
            console.log("mx",maxValue)
            document.getElementById("lg-exp-am").innerHTML = `${maxValue}`;
            document.getElementById("lg-exp").innerHTML = `${maxExpenseName}`;
            document.getElementById("total-inc").innerHTML = `${totalIncome}`
            document.getElementById("total-exp").innerHTML = `${totalExpenses}`
            document.getElementById("total-balance").innerHTML = `${totalIncome-totalExpenses}`
            document.getElementById("lg-ex-m").innerHTML = `${ms[maxExpense[0]]}`
            document.getElementById("lg-ex-am").innerHTML = `${maxExpense[1]}`;
            document.getElementById("lst-ex-m").innerHTML = `${ms[minExpense[0]]}`
            document.getElementById("lst-ex-am").innerHTML = `${minExpense[1]}`;
            document.getElementById("percentage").innerHTML = `${((+totalExpenses/+totalIncome)*100).toPrecision(3)}%`;
            document.getElementById("perc-circle").setAttribute("stroke-dasharray",`${(+totalExpenses/+totalIncome)*100},100`)
            console.log(ms[maxExpense[0]])
            console.log(+totalExpenses/+totalIncome)
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

