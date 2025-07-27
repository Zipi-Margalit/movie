import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, delay, Observable, of, pipe, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

   constructor(private http: HttpClient) {
        this.getJSON().subscribe(data => {
            console.log(data);
        });
    }

    public getJSON(): Observable<any> {
        return this.http.get("./assets/Response.json").pipe(
      catchError(this.handleError)
    );
    }
      private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
     
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
  updateMovieTitle(movieId: string, newTitle: string): Observable<any> {
    // Simulate API call
    return of({ success: true }).pipe(
      delay(500), // Simulate network delay
      tap(() => console.log(`Updated movie ${movieId} with title: ${newTitle}`))
    );
  }

}
