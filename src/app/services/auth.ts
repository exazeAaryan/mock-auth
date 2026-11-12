import { HttpClient , HttpParams } from "@angular/common/http";
import { inject , Injectable } from "@angular/core";
import { Observable } from "rxjs";

const baseURL = 'https://retail-portal-api-hjdgbnawb7d8becn.centralindia-01.azurewebsites.net';

const apiToken = 'SBDBDJBDJKSB^*DBDU*898989DKDBDDDKK';

@Injectable({
    providedIn : 'root'
})

export class Auth 
{
    private readonly http = inject(HttpClient);

    login(email : string , password : string) : Observable <unknown>
    {
        const body = new FormData();
        body.append('Email' , email.trim());
        body.append('Password' , password);

        const params = new HttpParams().set('ApiToken' , apiToken);

        return this.http.post(
            `${baseURL}/api/user/login`,
            body,
            {params},
        );
    }

    forgotPassword(email : string) : Observable <unknown>
    {
        const body = new FormData();
        body.append('Email' , email.trim());

        const params = new HttpParams().set('ApiToken', apiToken);
        
        return this.http.post(
            `${baseURL}/api/user/forgot-password`,
            body,
            {params}
        )

        
    } 
}