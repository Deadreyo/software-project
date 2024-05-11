import User from "../common/Classes/User";
import PageController from "../common/Interfaces/PageController";

export default class HomePageController implements PageController {

    public run(user: User): void {
        const countValue = document.getElementById('count');
        const incrementButton = document.getElementById('increment');
        const decrementButton = document.getElementById('decrement');
        
        const handleIncrement = () => {
            const currentValue = parseInt(countValue.textContent);
            countValue.textContent = currentValue + 1 + '';
        }
        
        const handleDecrement = () => {
            const currentValue = parseInt(countValue.textContent);
            countValue.textContent = currentValue - 1 + '';
        }
        
        incrementButton.addEventListener('click', handleIncrement);
        
        decrementButton.addEventListener('click', handleDecrement);
    }
    
}