import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {environment} from '../../environments/environment';
import {User} from '../models/user';
import {NotFoundError} from '../common/exceptions/not-found-error';
import {BadInputError} from '../common/exceptions/bad-input-error';
import {AppError} from '../common/exceptions/app-error';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private http: HttpClient) {
  }

  register(data: User): Observable<object> {
    console.log(data, 'ddd37');
    return this.http.post(`${environment.apiUrl}/register`, data, {headers: {skip: 'true'}})
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
