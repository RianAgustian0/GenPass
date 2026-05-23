import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Platform, ToastController } from '@ionic/angular';
import { Location } from '@angular/common';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {

  lastTimeBackPress = 0;
  timePeriodToExit = 2000;

  constructor(
    private storage: Storage,
    private platform: Platform,
    private location: Location,
    private toastController: ToastController
  ) {}

  async ngOnInit() {
    await this.storage.create();

    this.handleBackButton();
  }

  handleBackButton() {

    this.platform.backButton.subscribeWithPriority(10, async () => {

      const currentUrl = window.location.pathname;

      if (
        currentUrl === '/home' ||
        currentUrl === '/tabs/home'
      ) {

        const currentTime = new Date().getTime();

        if (currentTime - this.lastTimeBackPress < this.timePeriodToExit) {

          App.exitApp();

        } else {

          this.lastTimeBackPress = currentTime;

          const toast = await this.toastController.create({
            message: 'Tekan sekali lagi untuk keluar',
            duration: 1500,
            position: 'bottom'
          });

          await toast.present();

        }

      } else {

        this.location.back();

      }

    });

  }

}