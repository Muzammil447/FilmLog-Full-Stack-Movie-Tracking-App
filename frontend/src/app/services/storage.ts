import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Movie } from '../models/movie.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private storageReady = false;

  private usersKey = 'users';
  private currentUserKey = 'currentUser';
  private watchlistKey = 'watchlist';
  private watchedKey = 'watchedList';

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    await this.storage.create();
    this.storageReady = true;
  }

  private async ensureStorageReady() {
    if (!this.storageReady) {
      await this.init();
    }
  }

  async getUsers(): Promise<User[]> {
    await this.ensureStorageReady();
    return (await this.storage.get(this.usersKey)) || [];
  }

  async saveUsers(users: User[]): Promise<void> {
    await this.ensureStorageReady();
    await this.storage.set(this.usersKey, users);
  }

  async setCurrentUser(user: User): Promise<void> {
    await this.ensureStorageReady();
    await this.storage.set(this.currentUserKey, user);
  }

  async getCurrentUser(): Promise<User | null> {
    await this.ensureStorageReady();
    return await this.storage.get(this.currentUserKey);
  }

  async clearCurrentUser(): Promise<void> {
    await this.ensureStorageReady();
    await this.storage.remove(this.currentUserKey);
  }

  async getWatchlist(): Promise<Movie[]> {
    await this.ensureStorageReady();
    return (await this.storage.get(this.watchlistKey)) || [];
  }

  async saveWatchlist(movies: Movie[]): Promise<void> {
    await this.ensureStorageReady();
    await this.storage.set(this.watchlistKey, movies);
  }

  async getWatchedList(): Promise<Movie[]> {
    await this.ensureStorageReady();
    return (await this.storage.get(this.watchedKey)) || [];
  }

  async saveWatchedList(movies: Movie[]): Promise<void> {
    await this.ensureStorageReady();
    await this.storage.set(this.watchedKey, movies);
  }

  async addToWatchlist(movie: Movie): Promise<boolean> {
    const watchlist = await this.getWatchlist();
    const watchedList = await this.getWatchedList();

    const alreadyInWatchlist = watchlist.some(m => m.id === movie.id);
    const alreadyWatched = watchedList.some(m => m.id === movie.id);

    if (alreadyInWatchlist || alreadyWatched) {
      return false;
    }

    watchlist.push({
      ...movie,
      timesWatched: 0
    });

    await this.saveWatchlist(watchlist);
    return true;
  }

  async removeFromWatchlist(movieId: string): Promise<void> {
    const watchlist = await this.getWatchlist();
    const updatedList = watchlist.filter(m => m.id !== movieId);
    await this.saveWatchlist(updatedList);
  }

  async markAsWatched(movie: Movie): Promise<void> {
    await this.removeFromWatchlist(movie.id?.toString() || '');

    const watchedList = await this.getWatchedList();
    const existingMovie = watchedList.find(m => m.id === movie.id);

    if (existingMovie) {
      existingMovie.timesWatched = (existingMovie.timesWatched || 0) + 1;
    } else {
      watchedList.push({
        ...movie,
        timesWatched: 1
      });
    }

    await this.saveWatchedList(watchedList);
  }

  async removeFromWatched(movieId: string): Promise<void> {
    const watchedList = await this.getWatchedList();
    const updatedList = watchedList.filter(m => m.id !== movieId);
    await this.saveWatchedList(updatedList);
  }

  async resetWatchedMovie(movie: Movie): Promise<void> {
    await this.removeFromWatched(movie.id?.toString() || '');

    const resetMovie: Movie = {
      ...movie,
      timesWatched: 0
    };

    await this.addToWatchlist(resetMovie);
  }

  async isInWatchlist(movieId: string): Promise<boolean> {
    const watchlist = await this.getWatchlist();
    return watchlist.some(m => m.id === movieId);
  }

  async isInWatchedList(movieId: string): Promise<boolean> {
    const watchedList = await this.getWatchedList();
    return watchedList.some(m => m.id === movieId);
  }
}
