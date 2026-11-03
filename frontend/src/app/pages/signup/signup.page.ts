import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: false
})
export class SignupPage {

  name = '';
  email = '';
  password = '';
  confirmPassword = '';

  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController
  ) {}

  async signup() {
    if (!this.name || !this.email || !this.password || !this.confirmPassword) {
      await this.showAlert('Missing Details', 'Please complete all fields.');
      return;
    }

    if (this.password !== this.confirmPassword) {
      await this.showAlert('Password Error', 'Passwords do not match.');
      return;
    }

    this.authService.register({
      email: this.email,
      password: this.password
    }).subscribe({
      next: async () => {
        this.name = '';
        this.email = '';
        this.password = '';
        this.confirmPassword = '';

        await this.showAlert('Success', 'Your account has been created. Please log in.');
        await this.router.navigate(['/login']);
      },
error: async (error) => {
  console.log('Signup error:', error);

  const message =
    error?.error?.message ||
    error?.message ||
    'Could not create account. Please check that the backend is running.';

  await this.showAlert('Signup Failed', message);
}
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  goToLogin() {
    this.router.navigate(['/login']);
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
