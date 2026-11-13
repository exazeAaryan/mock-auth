import { HttpClient , HttpParams , HttpHeaders} from "@angular/common/http";
import { inject , Injectable } from "@angular/core";
import { Observable , throwError} from "rxjs";

const baseURL = 'https://retail-portal-api-hjdgbnawb7d8becn.centralindia-01.azurewebsites.net';

const apiToken = 'SBDBDJBDJKSB^*DBDU*797979DKDBDDDKK';

@Injectable({
    providedIn : 'root'
})

export class Auth 
{
    private readonly http = inject(HttpClient);
    private accessToken: string | null = null;

    setAccessToken(token: string): void {
        this.accessToken = token;
    }

    getAccessToken(): string | null {
        return this.accessToken;
    }

    getUser() : Observable<unknown>
    {
        const token = this.getAccessToken();
        if(!token)
        {
            return throwError(() => new Error('No Login Token is available'));
        }

        const params = new HttpParams().set('ApiToken' , apiToken);
        const headers = new HttpHeaders().set('Authorization' , `Bearer ${token}`);

        return this.http.get(`${baseURL}/api/user/list`, {
            params,
            headers,
        });
    }
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
