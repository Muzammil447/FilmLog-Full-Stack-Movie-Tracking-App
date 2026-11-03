import { Component } from '@angular/core';
import { AlertController, ViewWillEnter } from '@ionic/angular';
import { Chart, registerables } from 'chart.js';

import { Stats } from '../models/stats.model';
import { StatsService } from '../services/stats';

Chart.register(...registerables);

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
  standalone: false
})
export class Tab4Page implements ViewWillEnter {

  stats: Stats | null = null;

  genreChart: Chart | null = null;
  watchedChart: Chart | null = null;

  constructor(
    private statsService: StatsService,
    private alertController: AlertController
  ) {}

  ionViewWillEnter() {
    this.loadStats();
  }

  loadStats() {
    this.statsService.getStats().subscribe({
      next: (stats: Stats) => {
        this.stats = stats;

        setTimeout(() => {
          this.createGenreChart();
          this.createWatchedChart();
        }, 100);
      },
      error: async (error) => {
        console.log('Stats load error:', error);

        const message =
          error?.error?.message ||
          'Could not load statistics. Please make sure you are logged in.';

        await this.showAlert('Stats Error', message);
      }
    });
  }

  createGenreChart() {
    if (!this.stats) {
      return;
    }

    const canvas = document.getElementById('genreChart') as HTMLCanvasElement;

    if (!canvas) {
      return;
    }

    if (this.genreChart) {
      this.genreChart.destroy();
    }

    this.genreChart = new Chart(canvas, {
      type: 'pie',
      data: {
        labels: this.stats.topGenres.map((item) => item.genre),
        datasets: [
          {
            data: this.stats.topGenres.map((item) => item.count)
          }
        ]
      },
options: {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom'
    },
    title: {
      display: true,
      text: 'Top 6 Genres'
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          const values = context.dataset.data as number[];
          const total = values.reduce((sum, value) => sum + value, 0);
          const currentValue = context.parsed as number;
          const percentage = total > 0 ? Math.round((currentValue / total) * 100) : 0;

          return `${context.label}: ${currentValue} movie(s) - ${percentage}%`;
        }
      }
    }
  }
}
    });
  }

  createWatchedChart() {
    if (!this.stats) {
      return;
    }

    const canvas = document.getElementById('watchedChart') as HTMLCanvasElement;

    if (!canvas) {
      return;
    }

    if (this.watchedChart) {
      this.watchedChart.destroy();
    }

    this.watchedChart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: this.stats.timesWatchedPerMovie.map((item) => item.title),
        datasets: [
          {
            label: 'Times Watched',
            data: this.stats.timesWatchedPerMovie.map((item) => item.timesWatched)
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true
          },
          title: {
            display: true,
            text: 'Times Watched Per Movie'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0
            }
          }
        }
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
