import User from "../common/Classes/User";
import PageController from "../common/Interfaces/PageController";
import LoginController from "../common/LoginController";

export default class LoginPageController {
    loginController: LoginController;

    constructor() {
        this.loginController = new LoginController();

        const form = document.getElementById('paymentForm') as HTMLFormElement;

        form.addEventListener('submit', (event) => this.handleSubmit(event));
    }


    handleSubmit(event: Event) {
        event.preventDefault();
        console.log("Hello world")
        
        const emailInput = document.getElementById('email') as HTMLInputElement;
        const passwordInput = document.getElementById('password') as HTMLInputElement;
        const warningMessage = document.getElementById('warning') as HTMLParagraphElement;
        
        const new_user = {
            name: emailInput.value,
            password: passwordInput.value,
        };

        // Validate user data
        if (!this.validateEmail(new_user.name)) {
            warningMessage.textContent = 'Please enter a valid email address';
            warningMessage.style.visibility = 'visible';
            return;
        }

        if (!this.validatePassword(new_user.password)) {
            warningMessage.textContent = 'Password must be at least 8 characters long';
            warningMessage.style.visibility = 'visible';
            return;
        }

        this.loginController.signUp(new_user.name, new_user.password);

        console.log(new_user);
    }

    validateEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    validatePassword(password: string): boolean {
        return password.length >= 8;
    }
    
}