import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ITransfer } from '../dashboard/transfer-history/transfer-interface';
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
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
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
