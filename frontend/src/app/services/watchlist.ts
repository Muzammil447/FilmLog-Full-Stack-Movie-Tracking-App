import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movie } from '../models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class WatchlistService {

  private apiUrl = 'https://localhost:7172/api/Watchlist';

  constructor(private http: HttpClient) {}

  getWatchlist(): Observable<Movie[]> {
    return this.http.get<Movie[]>(this.apiUrl);
  }

  addToWatchlist(movie: Movie): Observable<any> {
    return this.http.post(this.apiUrl, movie);
  }

  removeFromWatchlist(title: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${encodeURIComponent(title)}`);
  }
}
