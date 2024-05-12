import User from "../common/Classes/User";
import PageController from "../common/Interfaces/PageController";

export default class DashboardPageController implements PageController {
  public run(user: User): void {
    console.log("Running DashboardPageController");
  }

  public handleDelete(): void {}

  public handleEdit(): void {}

  public handleExpand(): void {}

  public search(): void {}

  public fillTransactionTable(user: User): void {}
}
