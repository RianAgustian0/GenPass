import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { jsPDF } from 'jspdf';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

@Component({
  selector: 'app-tentang',
  templateUrl: './tentang.page.html',
  styleUrls: ['./tentang.page.scss'],
  standalone: false,
})
export class TentangPage implements OnInit {

  constructor(private storage: Storage) {}

  async ngOnInit() {
    await this.storage.create();
  }

  async downloadSavedPDF() {
    try {
      const data = await this.storage.get('saved') || [];

      if (data.length === 0) {
        alert('Data kosong 😐');
        return;
      }

      await this.generatePDF(data, 'Password_Tersimpan');

    } catch (err) {
      console.error(err);
      alert('Error: ' + err);
    }
  }

  async downloadHistoryPDF() {
    try {
      const data = await this.storage.get('history') || [];

      if (data.length === 0) {
        alert('Data kosong 😐');
        return;
      }

      await this.generatePDF(data, 'Riwayat_Password');

    } catch (err) {
      console.error(err);
      alert('Error: ' + err);
    }
  }

  async generatePDF(data: any[], title: string) {
    const doc = new jsPDF();
    let y = 20;

    doc.setFontSize(16);
    doc.text(title, 10, y);
    y += 10;

    doc.setFontSize(10);

    data.forEach((item, index) => {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }

      doc.text(`${index + 1}. ${item.value}`, 10, y);
      y += 6;

      doc.text(`Waktu: ${item.time}`, 10, y);
      y += 10;
    });

    const pdfOutput = doc.output('datauristring');
    const base64Data = pdfOutput.split(',')[1];

    const fileName = `${title}_${Date.now()}.pdf`;

    try {
      await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Documents,
      });

      alert('PDF berhasil disimpan!');

    } catch (err) {
      console.error(err);
      alert('Gagal simpan file!');
    }
  }
}