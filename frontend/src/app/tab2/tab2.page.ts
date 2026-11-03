import { Component } from '@angular/core';
import { AlertController, ViewWillEnter, LoadingController } from '@ionic/angular';
import { Movie } from '../models/movie.model';
import { WatchlistService } from '../services/watchlist';
import { WatchedService } from '../services/watched';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false
})
export class Tab2Page implements ViewWillEnter {

  watchlist: Movie[] = [];

  constructor(
    private watchlistService: WatchlistService,
    private watchedService: WatchedService,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {}

  ionViewWillEnter() {
    this.loadWatchlist();
  }

  loadWatchlist() {
    this.watchlistService.getWatchlist().subscribe({
      next: (movies) => {
        this.watchlist = movies;
      },
      error: async (error) => {
        console.log('Watchlist load error:', error);

        const message =
          error?.error?.message ||
          'Could not load your Watchlist. Please make sure you are logged in.';

        await this.showAlert('Watchlist Error', message);
      }
    });
  }

  async removeFromWatchlist(movie: Movie) {
    const loading = await this.loadingController.create({
      message: 'Removing movie...'
    });

    await loading.present();

    this.watchlistService.removeFromWatchlist(movie.title).subscribe({
      next: async () => {
        this.watchlist = this.watchlist.filter(m => m.title !== movie.title);
        await loading.dismiss();
        await this.showAlert('Removed', `${movie.title} was removed from your Watchlist.`);
      },
      error: async (error) => {
        console.log('Remove watchlist error:', error);

        await loading.dismiss();

        const message =
          error?.error?.message ||
          `${movie.title} could not be removed.`;

        await this.showAlert('Remove Error', message);
      }
    });
  }

  async markAsWatched(movie: Movie) {
    const loading = await this.loadingController.create({
      message: 'Moving to Watched List...'
    });

    await loading.present();

    this.watchedService.markAsWatched(movie).subscribe({
      next: async () => {
        this.watchlist = this.watchlist.filter(m => m.title !== movie.title);
        await loading.dismiss();
        await this.showAlert('Watched', `${movie.title} was moved to your Watched List.`);
      },
      error: async (error) => {
        console.log('Mark watched error:', error);

        await loading.dismiss();

        const message =
          error?.error?.message ||
          `${movie.title} could not be marked as watched.`;

        await this.showAlert('Watched Error', message);
      }
    });
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
