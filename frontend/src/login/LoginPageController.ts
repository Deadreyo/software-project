import User from "../common/Classes/User";
import PageController from "../common/Interfaces/PageController";
import LoginController from "../common/LoginController";

export default class LoginPageController {
    loginController: LoginController;

    constructor() {
        this.loginController = new LoginController();
        // ...
    }
    
}