import User from "./Classes/User";
import PageController from "./Interfaces/PageController";

export default class LoginController {

    private user: User;
    private dbKey: string = "userDatabase"
    private savedUserKey: string = "savedUser"
    
    signUp(email: string, password: string) {
        this.user = User.create(this, email)
        localStorage.setItem(this.dbKey, JSON.stringify({
            ...this.user.toJSON(),
            password
        }))
        localStorage.setItem(this.savedUserKey, JSON.stringify(this.user.toJSON()))
        window.location.href = "./homepage.html"
    }

    createGuestUser() {
        const exampleMail = "mail@example.com"
        const dummyPassword = "password123"
        this.signUp(exampleMail, dummyPassword)
    }
    
    login(email: string, password: string) {
        const savedUser = localStorage.getItem(this.dbKey)
        if (!savedUser) {
            return
        }

        const user = JSON.parse(savedUser)
        if (user.email === email && user.password === password) {
            delete user.password;
            localStorage.setItem(this.savedUserKey, JSON.stringify(user))
            window.location.href = "./homepage.html"
        } else {
            alert("Invalid email or password")
        }
    }

    logout() {
        localStorage.removeItem(this.savedUserKey)
        window.location.href = "./login.html"
    }

    checkSavedUser() {
        const savedUser = localStorage.getItem(this.dbKey)
        if (!savedUser) {
            window.location.href = "./login.html"
            return
        }

        const savedUserObj = JSON.parse(savedUser)
        this.user = User.load(this, savedUserObj)
    }

    async saveUser() {
        localStorage.setItem(this.dbKey, JSON.stringify(this.user.toJSON()))
    }

    static activatePage(pageController: PageController) {
        const controller = new LoginController();
        controller.checkSavedUser()
        pageController.run(controller.user)
    }
}
