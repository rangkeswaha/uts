import { Component } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { Reference } from '@angular/fire/storage/interfaces';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { FotoService, Photo } from '../service/foto.service';

interface data {
  judul : string,
  isi : string,
  tanggal : string,
  nilai : string,
  foto : string
}

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  cloudFiles = [];
  isiData : Observable<data[]>;
  isiDataColl : AngularFirestoreCollection<data>;

  constructor(
    afs : AngularFirestore,
    private afStorage : AngularFireStorage,
    public fotoService : FotoService,
    public router: Router
  ) {
    this.isiDataColl = afs.collection('dataUTS');
    this.isiData = this.isiDataColl.valueChanges();
  }

  async ionViewDidEnter(){
    this.loadFiles()
  }

  fototitle : string;
  fotoUpload : string;
  refimg : Reference;

  getNama(judulFoto : string, path: string, ref: Reference) {
    this.fotoUpload = path;
    this.fototitle = judulFoto;
    this.refimg = ref;
  }

  passinfo(judul: string, isi: string, tanggal: string, nilai: string, foto: string){
    this.fotoService.passjudul = judul;
    this.fotoService.passisi = isi;
    this.fotoService.passtanggal = tanggal;
    this.fotoService.passnilai = nilai;
    this.fotoService.passurlfoto = foto;
    this.router.navigate(['tab3'])
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

  deleteFile(judul: string, isi: string, tanggal: string, nilai: string, foto: string) {

    this.refimg.delete().then(() => {
      this.loadFiles();
    });
    this.isiDataColl.doc(judul).delete().then(() => {
        console.log("Document successfully deleted!");
    }).catch((error) => {
        console.error("Error removing document: ", error);
    });
  }

  deleteFile2(ref: Reference) {
    ref.delete().then(() => {
      this.loadFiles();
    });
  }

// db.collection("cities").doc("DC").delete().then(() => {
//     console.log("Document successfully deleted!");
// }).catch((error) => {
//     console.error("Error removing document: ", error);
// });

}
