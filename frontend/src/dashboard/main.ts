import LoginController from "../common/LoginController";
import common from "../common/main"
import DashboardPageController from "./DashboardPageController";
common();

const page = new DashboardPageController();

LoginController.activatePage(page);
