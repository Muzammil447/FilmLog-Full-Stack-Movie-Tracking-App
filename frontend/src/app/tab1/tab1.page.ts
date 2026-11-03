import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { Movie } from '../models/movie.model';
import { MovieService } from '../services/movie';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false
})
export class Tab1Page {

  searchTerm = '';
  movies: Movie[] = [];
  hasSearched = false;

  constructor(
    private movieService: MovieService,
    private authService: AuthService,
    private router: Router,
    private navController: NavController,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {}

  async searchMovies() {
    if (!this.searchTerm.trim()) {
      await this.showAlert('Search Required', 'Please enter a movie title.');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Searching movies...'
    });

    await loading.present();

    this.movieService.searchMovies(this.searchTerm.trim()).subscribe({
      next: async (results) => {
        this.movies = results;
        this.hasSearched = true;
        await loading.dismiss();
      },
      error: async (error) => {
        console.log('Movie search error:', error);

        this.movies = [];
        this.hasSearched = true;
        await loading.dismiss();

        const message =
          error?.error?.message ||
          'Could not load movies. Please make sure the backend is running.';

        await this.showAlert('Search Failed', message);
      }
    });
  }

  openDetails(movie: Movie) {
    this.router.navigate(['/movie-details'], {
      state: { movie }
    });
  }

  logout() {
    this.authService.logout();
    this.navController.navigateRoot('/login');
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });

    await alert.present();
  }
}
