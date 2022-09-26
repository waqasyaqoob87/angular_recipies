import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, catchError, Subject, tap, throwError } from "rxjs";
import { User } from "./user.model";
import { environment } from "src/environments/environment";

export interface AuthResponseData {
    idToken: String | any;
    email: String | any;
    refreshToken: string;
    expireIn: string;
    localId: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

    private tokenExpirationTimer:any;
    user = new BehaviorSubject<User | any>(null);

    constructor(private http: HttpClient,
        private router: Router) { }
    signup(email: string, password: string) {
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firbaseAPIKey,
            {
                email: email,
                password: password,
                returnSecureToken: true
            })
            .pipe(catchError(this.handleError),
                tap(resData => {
                    this.handleAuthentication(
                        resData.email,
                        resData.localId,
                        resData.idToken,
                        +resData.expireIn)
                }));
    }

    login(email: string, password: string) {
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firbaseAPIKey,
            {
                email: email,
                password: password,
                returnSecureToken: true
            })
            .pipe(catchError(this.handleError),
                tap(resData => {
                    this.handleAuthentication(
                        resData.email,
                        resData.localId,
                        resData.idToken,
                        +resData.expireIn)
                }))
    }
autoLogin(){
    const userData: {
        email: string;
        id: string;
        _token: string;
        _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData') || '{}');
    if(!userData){
        return;
    }

    const loadedUser = new User(
        userData.email, 
        userData.id, 
        userData._token, 
        new Date(userData._tokenExpirationDate));

    if(loadedUser.token){
        this.user.next(loadedUser);
        const expirationDuration = 
        new Date(userData._tokenExpirationDate)
        .getTime() - new Date().getTime();
        this.autoLogout(expirationDuration)
    }
}


    logout() {
        this.user.next(null);
        this.router.navigate(['/auth']);
        localStorage.removeItem('userData');
        
        if(this.tokenExpirationTimer){
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
    }

    autoLogout(expirationDuration: number){
        this.tokenExpirationTimer = setTimeout(() =>{
            this.logout();
        }, expirationDuration);
    }

    private handleAuthentication(
        email: string, 
        userId: string, 
        token: string, 
        expireIn: number) {
        const expirationDate = new Date(
            new Date().getTime() + expireIn * 1000
        );
        const user = new User(
            email,
            userId,
            token,
            expirationDate
        )
        this.user.next(user);
        // this.autoLogout(expireIn * 1000);
        localStorage.setItem('userData', JSON.stringify(user));
    }

    private handleError(errorRes: HttpErrorResponse) {
        let errorMessage = 'An Unknown error occurres!';
        if (!errorRes.error || !errorRes.error.error) {
            return throwError(errorMessage);
        }
        switch (errorRes.error.error.message) {
            case 'EMAIL_EXISTS':
                errorMessage = 'This email exists already';
                break;
            case 'EMAIL_NOT_FOUND':
                errorMessage = 'This email does not exist.';
                break;
            case 'INVALID_PASSWORD':
                errorMessage = 'This password is not correct';
                break;
        }
        return throwError(errorMessage);
    }
}