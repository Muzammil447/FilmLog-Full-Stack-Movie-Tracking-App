import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Stats } from '../models/stats.model';

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  private apiUrl = 'https://localhost:7172/api/Stats';

  constructor(private http: HttpClient) {}

  getStats(): Observable<Stats> {
    return this.http.get<Stats>(this.apiUrl);
  }
}
