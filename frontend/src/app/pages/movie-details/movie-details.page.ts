import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { Movie } from 'src/app/models/movie.model';
import { MovieService } from 'src/app/services/movie';
import { WatchlistService } from 'src/app/services/watchlist';
import { WatchedService } from 'src/app/services/watched';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.page.html',
  styleUrls: ['./movie-details.page.scss'],
  standalone: false
})
export class MovieDetailsPage implements OnInit {

  movie: Movie | null = null;
  isInWatchlist = false;
  isInWatchedList = false;

  constructor(
    private router: Router,
    private navController: NavController,
    private movieService: MovieService,
    private watchlistService: WatchlistService,
    private watchedService: WatchedService,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {}

  async ngOnInit() {
    const navigation = this.router.getCurrentNavigation();

    this.movie =
      navigation?.extras?.state?.['movie'] ||
      history.state?.movie ||
      null;

    if (!this.movie) {
      this.navController.back();
      return;
    }

    this.loadMovieDetails();
  }

  loadMovieDetails() {
    if (!this.movie) {
      return;
    }

    this.movieService.getMovieDetails(this.movie.title).subscribe({
      next: (details) => {
        this.movie = {
          ...this.movie,
          ...details
        };
      },
      error: (error) => {
        console.log('Movie details error:', error);
      }
    });
  }

  async addToWatchlist() {
    if (!this.movie) {
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Adding to Watchlist...'
    });

    await loading.present();

    this.watchlistService.addToWatchlist(this.movie).subscribe({
      next: async () => {
        this.isInWatchlist = true;
        await loading.dismiss();
        await this.showAlert('Added', `${this.movie?.title} was added to your Watchlist.`);
      },
      error: async (error) => {
        console.log('Add to watchlist error:', error);

        await loading.dismiss();

        const message =
          error?.error?.message ||
          `${this.movie?.title} could not be added to your Watchlist.`;

        await this.showAlert('Watchlist Error', message);
      }
    });
  }

  async markAsWatched() {
    if (!this.movie) {
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Marking as watched...'
    });

    await loading.present();

    this.watchedService.markAsWatched(this.movie).subscribe({
      next: async () => {
        this.isInWatchedList = true;
        this.isInWatchlist = false;

        await loading.dismiss();
        await this.showAlert('Watched', `${this.movie?.title} was added to your Watched List.`);
      },
      error: async (error) => {
        console.log('Mark as watched error:', error);

        await loading.dismiss();

        const message =
          error?.error?.message ||
          `${this.movie?.title} could not be marked as watched.`;

        await this.showAlert('Watched Error', message);
      }
    });
  }

  goBack() {
    this.navController.back();
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
