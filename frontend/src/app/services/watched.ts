import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movie } from '../models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class WatchedService {

  private apiUrl = 'https://localhost:7172/api/Watched';

  constructor(private http: HttpClient) {}

  getWatchedList(): Observable<Movie[]> {
    return this.http.get<Movie[]>(this.apiUrl);
  }

  markAsWatched(movie: Movie): Observable<any> {
    return this.http.post(this.apiUrl, movie);
  }

  incrementTimesWatched(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, {});
  }

  removeFromWatched(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  resetWatchedMovie(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset/${id}`, {});
  }
}
