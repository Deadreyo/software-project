import LoginController from "../common/LoginController";
import common from "../common/main"
import LoginPageController from "./LoginPageController";
common();


const page = new LoginPageController();

new LoginController(page);