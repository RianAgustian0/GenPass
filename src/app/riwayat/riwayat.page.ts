import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-riwayat',
  templateUrl: './riwayat.page.html',
  styleUrls: ['./riwayat.page.scss'],
  standalone: false,
})
export class RiwayatPage implements OnInit {

  saved: any[] = [];
  history: any[] = [];

  constructor(private storage: Storage) {}

  async ngOnInit() {
    await this.loadData();
  }

  async ionViewWillEnter() {
    await this.loadData();
  }

  async loadData() {
    const savedAll = await this.storage.get('saved') || [];
    const historyAll = await this.storage.get('history') || [];

    this.saved = savedAll; 
    this.history = historyAll.slice(0, 10);
  }

  async clearHistory() {
  const confirm = window.confirm('Hapus semua riwayat?');

  if (!confirm) return;

  await this.storage.set('history', []);
  this.loadData();
}

  async deleteSaved(index: number) {
  let savedAll = await this.storage.get('saved') || [];

  savedAll.splice(index, 1);

  await this.storage.set('saved', savedAll);

  this.loadData();
}
  copy(text: string) {
    navigator.clipboard.writeText(text);
  }

}