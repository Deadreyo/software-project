import User from "./Classes/User";
import PageController from "./Interfaces/PageController";

export default class LoginController {

    private user: User;
    
    async signUp(email: string, password: string) {
        this.user = User.create(this, email)
        const req = await fetch("http://localhost:3000/users/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password,
            }),
            credentials: "include",
        });

        const res = await req.json();
        if (res.error) {
            alert(res.error)
            return
        }
        window.location.href = "./homepage.html"
    }
    
    async login(email: string, password: string) {
        const req = await fetch("http://localhost:3000/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password,
            }),
        });

        const res = await req.json();
        if (res.error) {
            alert(res.error)
            return
        }

        window.location.href = "./homepage.html"
    }

    async logout() {
        await fetch("http://localhost:3000/users/logout")        
        window.location.href = "./login.html"
    }

    async checkSavedUser() {

        try {
            const req = await fetch("http://localhost:3000/users/", {
                method: 'GET',
                headers: {
                  'Accept': 'application/json'
                },
                credentials: 'include',
            })

            if (req.status === 401) {
                window.location.href = "./login.html"
                return
            }
            
            const user = await req.json()
            this.user = User.load(this, user)
        } catch (e) {
            window.location.href = "./login.html"
        }
    }

    async saveUser() {
        const req = await fetch("http://localhost:3000/users/update", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.user.toJSON()),
            credentials: "include",
        });

        if(req.status === 401) {
            window.location.href = "./login.html"
            return
        }

        const res = await req.json();
        if (res.error) {
            alert(res.error)
            return
        }
    }

    static activatePage(pageController: PageController) {
        const controller = new LoginController();
        controller.checkSavedUser()
        pageController.run(controller.user)
    }
}
