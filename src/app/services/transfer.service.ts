import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ITransfer } from '../transfer-history/transfer-interface';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TransferService {

  private transferUrl = './api/transfers';


  constructor(private http: HttpClient) { }

  getTransfers(): Observable<ITransfer[]> {
    return this.http.get<ITransfer[]>(this.transferUrl)
    .pipe(
      catchError(this.handleError)
    );
  }

  private handleError(err) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }

  submitTransfer(transfer: ITransfer): Observable<ITransfer> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<ITransfer>(this.transferUrl, transfer, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }
  // }
}
