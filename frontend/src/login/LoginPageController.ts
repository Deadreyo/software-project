import User from "../common/Classes/User";
import PageController from "../common/Interfaces/PageController";
import LoginController from "../common/LoginController";

export default class LoginPageController {
    private loginController: LoginController;

    constructor() {
        this.loginController = new LoginController();
        this.logout();
        this.setupLoginForm();
        this.setupSignupForm();
    }


    private setupLoginForm() {
        const loginForm = document.getElementById("signinForm") as HTMLFormElement;
        loginForm?.addEventListener("submit", (event) => {
            event.preventDefault();
            const email = (document.getElementById("login-email") as HTMLInputElement).value;
            const password = (document.getElementById("login-password") as HTMLInputElement).value;
            this.login(email, password);
        });
    }

    private setupSignupForm() {
        const passwordInput1 = document.getElementById("password1") as HTMLInputElement;
        const passwordInput2 = document.getElementById("password2") as HTMLInputElement;
        const signUpButton = document.getElementById("signup-button");

        signUpButton?.addEventListener("click", (event) => {
            event.preventDefault();
            const username = (document.getElementById("signup-username") as HTMLInputElement).value;
            const email = (document.getElementById("signup-email") as HTMLInputElement).value;
            const password = passwordInput1.value;
            const passwordConfirm = passwordInput2.value;

            if (password !== passwordConfirm) {
                alert("Passwords do not match");
                return;
            }

            this.signUp(username, email, password);
        });
    }
    private login(email: string, password: string) {
        this.loginController.login(email, password);
    }

    private signUp(username: string, email: string, password: string) {
        this.loginController.signUp(email, password);
    }

    private logout() {
        const logoutButton = document.getElementById("logoutButton");

        logoutButton?.addEventListener("click", () => {
            this.loginController.logout();

        });
    }
}
