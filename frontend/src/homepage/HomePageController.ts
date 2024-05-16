import Transaction from "../common/Classes/Transaction";
import User from "../common/Classes/User";
import PageController from "../common/Interfaces/PageController";
import Chart from 'chart.js/auto'

export default class HomePageController implements PageController {
    public run(user: User): void {
        console.log(user);
        const transactions = user.getAllTransactions();
        console.log(transactions);
        const categories = user.getCategories();
        // const burger = document.getElementById('burger');
        // const closeMenuBtn = document.getElementById("close");
        // const menu = document.getElementById("menu");
        const categoryData = [
            {category:"Food", amount: 100},
            {category:"Entertainment", amount: 200},
            {category:"Utilities", amount: 100},
            {category:"shopping", amount: 100},
        ]
        const x = categoryData.map(genre => genre.category); 
        const y = categoryData.map(genre => genre.amount); 
        const color = ["#1E2760","#1D4ED8","#7A2048","blue"]
        // const color = ["#37A2EB","#FF6383","#FF9F40","#FFCD56"]
        let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
        let monthlyIncome = [] 
        let monthlyExpense = [] 
        let total = [];
        for(let i=0;i<12;i++){
            monthlyIncome.push(100+10*i);
            if(i % 2 === 0) monthlyExpense.push(20 + 5*i);
            else monthlyExpense.push(40 - 3*i);
            total.push(monthlyIncome[i] - monthlyExpense[i]);
        }
        const yearButton = document.getElementById("year");
        yearButton.onchange = (e:MouseEvent)=>{
            e.preventDefault();
            const target = e.target as HTMLInputElement;
            const year = target.value;
            console.log(year)
            const data = transactions.filter(transaction=>transaction.year === year);
        }
        window.onload = ()=>{
            const recent = transactions.splice(transactions.length-10);
            const recentContainer = document.getElementById("my-transactions");
            for(let i=0;i<recent.length;i++){
                const transaction = document.createElement("div");
                const name = document.createElement("div");
                const amount = document.createElement("div");
                name.innerHTML = recent[i].getName();
                if(recent[i].getType() === "income"){
                    amount.innerHTML = "+" + recent[i].getAmount().toString();
                    amount.style.color = "green;"
                }else{
                    amount.innerHTML = "-" + recent[i].getAmount().toString();
                    amount.style.color = "red;"
                }
                transaction.appendChild(name)
                transaction.appendChild(amount)
                transaction.classList.add("transaction");

            }
        }

        const pieChart = new Chart("pie-chart",{
            type:"pie",
            data: {
                labels: x,
                datasets:[{
                    backgroundColor: color,
                    data: y,
                }]
            },
        });
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

        const pieChartRecords = new Chart("pie-chart-small",{
            type:"pie",
            data: {
                labels: x,
                datasets:[{
                    backgroundColor: color,
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

        

        // function openMenu(){
        //     menu.style.transform = "translateX(0)";
        //     console.log("abc")
        // }
        // function closeMenu(){
        //     menu.style.transform = "translateX(100%)";
        //     console.log("abc")
        // }



        // burger.addEventListener("click",openMenu)
        // closeMenuBtn.addEventListener("click",closeMenu)
    }
}

