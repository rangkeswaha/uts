import { Component } from '@angular/core';
import { FotoService } from '../service/foto.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Router } from '@angular/router';

export interface fileFoto {
  name : string; //filepath
  path : string; //webviewpath
}

interface data {
  judul : string,
  isi : string,
  tanggal : string,
  nilai : string,
  foto : string
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
    afs : AngularFirestore,
    public fotoService : FotoService,
    public router: Router) {
      this.isiDataColl = afs.collection('dataUTS');
      this.isiData = this.isiDataColl.valueChanges();
    }


  isiData : Observable<data[]>;
  isiDataColl : AngularFirestoreCollection<data>;
  

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

  delete(){
    this.isiDataColl.doc(this.judul).delete();
  }

  judul : string = this.fotoService.passjudul
  isi : string = this.fotoService.passisi
  tanggal : string = this.fotoService.passtanggal
  nilai : string = this.fotoService.passnilai
  foto : string = this.fotoService.passurlfoto
}
