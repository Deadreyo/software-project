import LoginController from "../common/LoginController";
import common from "../common/main"
import HomePageController from "./HomePageController";
common();


const page = new HomePageController();

new LoginController(page);

