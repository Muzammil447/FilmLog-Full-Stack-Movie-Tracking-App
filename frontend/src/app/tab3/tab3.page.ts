import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ViewWillEnter } from '@ionic/angular';
import { Movie } from '../models/movie.model';
import { WatchedService } from '../services/watched';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false
})
export class Tab3Page implements ViewWillEnter {

  watchedList: Movie[] = [];

  constructor(
    private watchedService: WatchedService,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {}

  ionViewWillEnter() {
    this.loadWatchedList();
  }

  loadWatchedList() {
    this.watchedService.getWatchedList().subscribe({
      next: (movies) => {
        this.watchedList = movies;
      },
      error: async (error) => {
        console.log('Watched list load error:', error);

        const message =
          error?.error?.message ||
          'Could not load your Watched List. Please make sure you are logged in.';

        await this.showAlert('Watched Error', message);
      }
    });
  }

  openDetails(movie: Movie) {
    this.router.navigate(['/movie-details'], {
      state: { movie }
    });
  }

  async incrementTimesWatched(movie: Movie, event?: Event) {
    if (event) {
      event.stopPropagation();
    }

    if (!movie.id) {
      await this.showAlert('Update Error', 'Movie ID was not found.');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Updating times watched...'
    });

    await loading.present();

    this.watchedService.incrementTimesWatched(Number(movie.id)).subscribe({
      next: async () => {
        await loading.dismiss();
        this.loadWatchedList();
      },
      error: async (error) => {
        console.log('Increment watched error:', error);

        await loading.dismiss();

        const message =
          error?.error?.message ||
          `${movie.title} could not be updated.`;

        await this.showAlert('Update Error', message);
      }
    });
  }

  async removeMovie(movie: Movie, event?: Event) {
    if (event) {
      event.stopPropagation();
    }

    if (!movie.id) {
      await this.showAlert('Remove Error', 'Movie ID was not found.');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Removing movie...'
    });

    await loading.present();

    this.watchedService.removeFromWatched(Number(movie.id)).subscribe({
      next: async () => {
        this.watchedList = this.watchedList.filter(m => m.id !== movie.id);
        await loading.dismiss();
        await this.showAlert('Removed', `${movie.title} was removed from your Watched List.`);
      },
      error: async (error) => {
        console.log('Remove watched error:', error);

        await loading.dismiss();

        const message =
          error?.error?.message ||
          `${movie.title} could not be removed.`;

        await this.showAlert('Remove Error', message);
      }
    });
  }

  async resetMovie(movie: Movie, event?: Event) {
    if (event) {
      event.stopPropagation();
    }

    if (!movie.id) {
      await this.showAlert('Reset Error', 'Movie ID was not found.');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Moving back to Watchlist...'
    });

    await loading.present();

    this.watchedService.resetWatchedMovie(Number(movie.id)).subscribe({
      next: async () => {
        this.watchedList = this.watchedList.filter(m => m.id !== movie.id);

        await loading.dismiss();
        await this.showAlert('Reset Complete', `${movie.title} was moved back to your Watchlist.`);
      },
      error: async (error) => {
        console.log('Reset watched error:', error);

        await loading.dismiss();

        const message =
          error?.error?.message ||
          `${movie.title} could not be moved back to your Watchlist.`;

        await this.showAlert('Reset Error', message);
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
