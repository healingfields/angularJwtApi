import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';

import {catchError} from 'rxjs/operators';
import {NotFoundError} from '../common/exceptions/not-found-error';
import {BadInputError} from '../common/exceptions/bad-input-error';
import {AppError} from '../common/exceptions/app-error';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private url: string, private http: HttpClient) {
  }

  getAll(): Observable<any> {
    return this.http.get(this.url)
      .pipe(
        catchError(this.handleError)
      );
  }

  getOne(id): Observable<any> {
    return this.http.get(`${this.url}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  create(resource): Observable<any> {
    return this.http.post(this.url, resource)
      .pipe(
        catchError(this.handleError)
      );
  }

  update(id, resource): Observable<any> {
    return this.http.put(`${this.url}/${id}`, resource)
      .pipe(
        catchError(this.handleError)
      );
  }

  delete(id): Observable<any> {
    return this.http.delete(`${this.url}/${id}`)
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

