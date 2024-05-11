import User from "../Classes/User";

export default interface PageController {
    run(user: User): void;
}