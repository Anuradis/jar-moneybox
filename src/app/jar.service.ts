import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of, throwError, pipe } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { IJar } from './jar/jar-interface';

@Injectable({
  providedIn: 'root'
})
export class JarService {

private jarUrl = 'api/jars';

  constructor(private http: HttpClient) { }

  getJars(): Observable<IJar[]> {
    return this.http.get<IJar[]>(this.jarUrl)
    .pipe(
      tap(data => console.log(JSON.stringify(data))),
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
}
