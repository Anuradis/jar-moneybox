import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of, throwError, pipe } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { IJar } from '../jar/jar-interface';

@Injectable({
  providedIn: 'root'
})
export class JarService {

  private jarUrl = './api/jars';


  constructor(private http: HttpClient) { }

  getJars(): Observable<IJar[]> {
    return this.http.get<IJar[]>(this.jarUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  addNewJar(createdJar: IJar): Observable<IJar> {
    const headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<IJar>(this.jarUrl, createdJar, { headers })
      .pipe(
        map(() => createdJar),
        catchError(this.handleError)
      );
  }

  updateJar(newValue: IJar): Observable<IJar> {
    const headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<IJar>(this.jarUrl, newValue, { headers })
      .pipe(
        map(() => newValue),
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
