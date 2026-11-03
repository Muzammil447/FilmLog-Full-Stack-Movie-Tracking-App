import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movie } from '../models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  private apiUrl = 'https://localhost:7172/api/Movies';

  constructor(private http: HttpClient) {}

  searchMovies(title: string): Observable<Movie[]> {
    const params = new HttpParams().set('t', title);
    return this.http.get<Movie[]>(`${this.apiUrl}/search`, { params });
  }

  getMovieDetails(title: string): Observable<Movie> {
    const params = new HttpParams().set('t', title);
    return this.http.get<Movie>(`${this.apiUrl}/details`, { params });
  }
}
