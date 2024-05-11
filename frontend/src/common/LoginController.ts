import User from "./Classes/User";
import PageController from "./Interfaces/PageController";

export default class LoginController {


    constructor(pageController: PageController) {
        User.create(this, "ahmed@yahoo.com")
            .then((user) => {
                pageController.run(user)
            });
    }
}