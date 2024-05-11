import LoginController from "../common/LoginController";
import common from "../common/main"
import FormPageController from "./FormPageController";
common();


const page = new FormPageController();

LoginController.activatePage(page);