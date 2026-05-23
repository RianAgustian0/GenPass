import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  length: number = 16;
  useUppercase: boolean = true;
  useLowercase: boolean = true;
  useNumbers: boolean = true;
  useSymbols: boolean = true;

  generatedPassword: string = '';
  fontSize: string = '20px';
  prefix: string = '';

  constructor(private storage: Storage) {}

  clearPassword() {
    this.generatedPassword = '';
    this.adjustFontSize();
  }

  adjustFontSize() {
    const len = this.generatedPassword.length;

    if (len <= 16) this.fontSize = '20px';
    else if (len <= 24) this.fontSize = '16px';
    else if (len <= 32) this.fontSize = '13px';
    else this.fontSize = '11px';
  }

  async generatePassword() {
    let chars = '';

    if (this.useUppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (this.useLowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (this.useNumbers) chars += '0123456789';
    if (this.useSymbols) chars += '!@#$%^&*()_+{}[]<>?';

    if (!chars) {
      this.generatedPassword = 'Pilih minimal 1 opsi';
      this.adjustFontSize();
      return;
    }

    const prefixValue = this.prefix || '';
    const remainingLength = this.length - prefixValue.length;

    if (remainingLength <= 0) {
      this.generatedPassword = prefixValue.substring(0, this.length);
      this.adjustFontSize();
      await this.saveToHistory(this.generatedPassword);
      return;
    }

    let password = '';

    for (let i = 0; i < remainingLength; i++) {
      password += chars[Math.floor(Math.random() * chars.length)];
    }

    this.generatedPassword = prefixValue + password;

    this.adjustFontSize();
    await this.saveToHistory(this.generatedPassword);
  }

  async saveToHistory(password: string) {
    let history = await this.storage.get('history') || [];

    history.unshift({
      value: password,
      time: new Date().toLocaleString()
    });

    await this.storage.set('history', history);
  }

  async savePassword() {
    if (!this.generatedPassword) return;

    let saved = await this.storage.get('saved') || [];

    const isDuplicate = saved.some(
      (item: any) => item.value === this.generatedPassword
    );

    if (isDuplicate) return;

    saved.unshift({
      value: this.generatedPassword,
      time: new Date().toLocaleString()
    });

    await this.storage.set('saved', saved);
  }

  copyPassword() {
    if (!this.generatedPassword) return;

    navigator.clipboard.writeText(this.generatedPassword);
  }

}