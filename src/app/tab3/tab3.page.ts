import { Component } from '@angular/core';
import { FotoService } from '../service/foto.service';
import { AngularFireStorage } from '@angular/fire/storage';

export interface fileFoto {
  name : string; //filepath
  path : string; //webviewpath
}

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  urlImageStorage : string[] = [];
  namafoto : string[] = [];
  cloudFiles = [];

  constructor(private afStorage : AngularFireStorage,
    public fotoService : FotoService) {}


  async ionViewDidEnter(){
    this.loadFiles()
  }

  loadFiles(){
    this.cloudFiles = [];

    const storageRef = this.afStorage.storage.ref('imgStorage');
    storageRef.listAll().then(result => {
      result.items.forEach(async ref => {
        this.cloudFiles.push({
          name: ref.name,
          full: ref.fullPath,
          ref,
          url: await ref.getDownloadURL()
        });
      });
    });
  }

  judul : string = this.fotoService.passjudul
  isi : string = this.fotoService.passisi
  tanggal : string = this.fotoService.passtanggal
  nilai : string = this.fotoService.passnilai
  foto : string = this.fotoService.passurlfoto
}
