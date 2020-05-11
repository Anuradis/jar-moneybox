import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private currencyOptionsUrl = './api/currencyOptions';


  constructor(private http: HttpClient) { }

  getCurrencyOptions(): Observable<[]> {
    return this.http.get<[]>(this.currencyOptionsUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(err) {

    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }
}
