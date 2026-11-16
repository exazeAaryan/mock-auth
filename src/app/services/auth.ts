import { HttpClient , HttpParams , HttpHeaders} from "@angular/common/http";
import { isPlatformBrowser } from "@angular/common";
import { inject , Injectable , PLATFORM_ID} from "@angular/core";
import { Observable , throwError} from "rxjs";

const baseURL = 'https://retail-portal-api-hjdgbnawb7d8becn.centralindia-01.azurewebsites.net';

const apiToken = 'SBDBDJBDJKSB^*DBDU*797979DKDBDDDKK';

@Injectable({
    providedIn : 'root'
})

export class Auth 
{
    private readonly http = inject(HttpClient);
    private readonly platformId = inject(PLATFORM_ID);
    private readonly tokenStorageKey = 'redefine_access_token';
    private readonly accountNameStorageKey = 'redefine_account_name';
    private accessToken: string | null = this.readStoredAccessToken();
    private accountName: string | null = this.readStoredAccountName();

    setAccessToken(token: string): void {
        this.accessToken = token;

        if (isPlatformBrowser(this.platformId)) {
            try {
                localStorage.setItem(this.tokenStorageKey, token);
            } catch {
                // Keep the token in memory if browser storage is unavailable.
            }
        }
    }

    getAccessToken(): string | null {
        return this.accessToken;
    }

    setAccountName(accountName: string): void {
        this.accountName = accountName;

        if (isPlatformBrowser(this.platformId)) {
            try {
                localStorage.setItem(this.accountNameStorageKey, accountName);
            } catch {
                // Keep the account name in memory if browser storage is unavailable.
            }
        }
    }

    getAccountName(): string | null {
        return this.accountName;
    }

    clearAccessToken(): void {
        this.accessToken = null;
        this.accountName = null;

        if (isPlatformBrowser(this.platformId)) {
            try {
                localStorage.removeItem(this.tokenStorageKey);
                localStorage.removeItem(this.accountNameStorageKey);
            } catch {
                // The in-memory token is still cleared if browser storage is unavailable.
            }
        }
    }

    private readStoredAccessToken(): string | null {
        if (!isPlatformBrowser(this.platformId)) {
            return null;
        }

        try {
            return localStorage.getItem(this.tokenStorageKey);
        } catch {
            return null;
        }
    }

    private readStoredAccountName(): string | null {
        if (!isPlatformBrowser(this.platformId)) {
            return null;
        }

        try {
            return localStorage.getItem(this.accountNameStorageKey);
        } catch {
            return null;
        }
    }

    getUser(pageNumber : number , pageCount : number = 10) : Observable<unknown>
    {
        const token = this.getAccessToken();
        if(!token)
        {
            return throwError(() => new Error('No Login Token is available'));
        }

        const params = new HttpParams()
            .set('ApiToken', apiToken)
            .set('PageNo', pageNumber)
            .set('PerPage', pageCount);
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
