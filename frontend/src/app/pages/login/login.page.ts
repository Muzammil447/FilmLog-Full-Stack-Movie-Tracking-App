import { Component } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage {

  email = '';
  password = '';
  showPassword = false;

  constructor(
    private authService: AuthService,
    private navController: NavController,
    private alertController: AlertController
  ) {}

  async login() {
    console.log('Login button clicked');

    if (!this.email || !this.password) {
      await this.showAlert('Missing Details', 'Please enter your email and password.');
      return;
    }

    this.authService.login({
      email: this.email,
      password: this.password
    }).subscribe({
      next: async (response) => {
        console.log('Login successful:', response);

        this.email = '';
        this.password = '';

        await this.navController.navigateRoot('/tabs/search');
      },
      error: async (error) => {
        console.log('Login error:', error);

        const message =
          error?.error?.message ||
          error?.message ||
          'Invalid email or password.';

        await this.showAlert('Login Failed', message);
      }
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  goToSignup() {
    this.navController.navigateForward('/signup');
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
