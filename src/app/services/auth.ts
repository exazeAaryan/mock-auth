import { Injectable } from "@angular/core";
import { email } from "@angular/forms/signals";

@Injectable({
    providedIn :'root'
})

export class Auth {
    //Mock user

    private mockUser = {
        email : 'admin@example.com',
        password : 'Admin@123'
    };

    login(email : string , password : string ) : boolean {
        return (
            email.trim().toLowerCase() === this.mockUser.email && password === this.mockUser.password
        );
    }
}