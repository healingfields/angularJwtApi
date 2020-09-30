import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {environment} from '../../environments/environment';
import {catchError} from 'rxjs/operators';
import {NotFoundError} from '../common/exceptions/not-found-error';
import {BadInputError} from '../common/exceptions/bad-input-error';
import {AppError} from '../common/exceptions/app-error';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor(private http: HttpClient) {
  }

  login(data: { email: string, password: string }): Observable<object> {
    return this.http.post(`${environment.apiUrl}/login`, data)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 404) {
      // return Observable.throw(new NotFoundError());
      return throwError(new NotFoundError(error));
    }
    if (error.status === 400) {
      // return Observable.throw(new BadInputError());
      return throwError(new BadInputError(error));
    }
    // return Observable.throw(new AppError());
    return throwError(new AppError(error));
  }
}

