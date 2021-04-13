import { Component } from '@angular/core';
import { FotoService, Photo } from '../service/foto.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { ToastController } from '@ionic/angular';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

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
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  urlImageStorage : string[] = [];
  nomor : string[] = ["1", "2"];
  a = 0;

  judulnote : string;
  isinote : string;
  tanggalnote : string;
  nilainote : string;

  constructor(public fotoservice: FotoService,
    public fotoService : FotoService,
    public afStorage : AngularFireStorage,
    public toastCtrl : ToastController,
    afs : AngularFirestore) 
    {
      this.isiDataColl = afs.collection('dataUTS');
      this.isiData = this.isiDataColl.valueChanges();
    }

  isiData : Observable<data[]>;
  isiDataColl : AngularFirestoreCollection<data>;
  
  tambahfoto(){
    this.fotoservice.tambahfoto();
  }

  fototitle : string;
  fotoUpload : Photo;

  getNama(judulFoto : Photo) {
    this.fotoUpload = judulFoto;
    this.fototitle = judulFoto.filePath;
  }

  async ngOnInit(){
    await this.fotoservice.loadFoto();
    this.tampilkanData();
  }

  tampilkanData(){
    this.urlImageStorage = [];
    var refImage = this.afStorage.storage.ref('imgStorage');
    refImage.listAll().then((res) => {
      res.items.forEach((itemRef) => {
        itemRef.getDownloadURL().then(url => {
          this.urlImageStorage.unshift(url)
        })
      });
    }).catch((error) => {
      console.log(error);
    });
  }

  uploadFoto(){
    this.urlImageStorage = [];
    for (var index in this.fotoService.dataFoto){
      const imgFilepath = `imgStorage/${this.fotoService.dataFoto[index].filePath}`;

      this.afStorage.upload(imgFilepath, this.fotoService.dataFoto[index].dataImage).then(() => {
        this.afStorage.storage.ref().child(imgFilepath).getDownloadURL()
      });
    }
    this.a += 1;
  }

  clickupload(){
    const imgfilepath = `imgStorage/${this.fotoUpload.filePath}`;
    this.afStorage.upload(imgfilepath, this.fotoUpload.dataImage).then(()=> {
      console.log(this.fotoUpload);
      this.showToast();
    });

    this.isiDataColl.doc(this.judulnote).set({
      judul : this.judulnote,
      isi : this.isinote,
      tanggal : this.tanggalnote,
      nilai : this.nilainote,
      foto : this.fototitle
    })

    this.judulnote = "";
    this.isinote = "";
    this.tanggalnote = "";
    this.nilainote = "";
  }

  async showToast() {
    await this.toastCtrl.create({
      message: 'Upload Selesai',
      duration : 2000,
      position : 'middle'
    }).then(res => res.present());
  }

}
