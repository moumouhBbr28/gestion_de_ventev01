import { Component, ViewChild } from '@angular/core';
import { NavController, AlertController, Platform } from 'ionic-angular';

import { Storage } from '@ionic/storage';

import { ServerConfigProvider } from "../../providers/server-config/server-config";
import { LgAccueilPage } from "../../pages/lg-accueil/lg-accueil";
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import { File, IWriteOptions } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { PDFGenerator } from '@ionic-native/pdf-generator/ngx';

import JSPDF from 'jspdf';
import domtoimage from 'dom-to-image';
import { TestPrinterPage } from '../test-printer/test-printer';

@Component({
  selector: 'page-server-config',
  templateUrl: 'server-config.html',
})

export class ServerConfigPage {
  
  letterObj = {
    to: '',
    from: '',
    text: ''
  }

  pdfObj = null;

  
  htmlSample: any;

  adressip: string;

  public data;


  constructor(public alertCtrl: AlertController,
    public serverApi: ServerConfigProvider,
    public storage: Storage,
    public navCtrl: NavController,
    private file: File, private fileOpener: FileOpener,
    private pdfGenerator:PDFGenerator) {
    this.storage.get('ip').then((val) => {
      this.adressip = val;
    });
  }

  setInfo($adressip) {
    this.serverApi.setSever($adressip);

    let alert = this.alertCtrl.create({
      title: "Information",
      subTitle: 'Configuration terminée',
      buttons: [
        {
          text: 'OK',
          handler: () => { }
        },
      ]
    });
    alert.present();
  }

  back_go() {
    this.navCtrl.pop();
  }
 /* getBase64ImageFromURL(url) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute("crossOrigin", "anonymous");
      img.onload = () => {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL("/assets/imgs/kids.jpg");
        resolve(dataURL);
      };
      img.onerror = error => {
        reject(error);
      };
      img.src = url;
    });
  }
  createPdf() {
    const pdfBlock = document.getElementById("print-wrapper");
    
    const options = { 
      background: "white", 
      height: pdfBlock.clientWidth, 
      width: pdfBlock.clientHeight 
    };

    domtoimage.toPng(pdfBlock, options).then((fileUrl) => {
      var doc = new JSPDF("p","mm","a4");
      doc.addImage(fileUrl, 'PNG', 10, 10, 240, 180);
  
      let docRes = doc.output();
      let buffer = new ArrayBuffer(docRes.length);
      let array = new Uint8Array(buffer);
      for (var i = 0; i < docRes.length; i++) {
          array[i] = docRes.charCodeAt(i);
      }
  
  
      const directory = this.file.dataDirectory;
      const fileName = "user-data.pdf";

      let options: IWriteOptions = { 
        replace: true 
      };
  
      this.file.checkFile(directory, fileName).then((res)=> {
        this.file.writeFile(directory, fileName,buffer, options)
        .then((res)=> {
          console.log("File generated" + JSON.stringify(res));
          this.fileOpener.open(this.file.dataDirectory + fileName, 'application/pdf')
            .then(() => console.log('File is exported'))
            .catch(e => console.log(e));
        }).catch((error)=> {
          console.log(JSON.stringify(error));
        });
      }).catch((error)=> {
        this.file.writeFile(directory,fileName,buffer).then((res)=> {
          console.log("File generated" + JSON.stringify(res));
          this.fileOpener.open(this.file.dataDirectory + fileName, 'application/pdf')
            .then(() => console.log('File exported'))
            .catch(e => console.log(e));
        })
        .catch((error)=> {
          console.log(JSON.stringify(error));
        });
      });
    }).catch(function (error) {
      console.error(error);
    });
  }
  async createPdf2() {
    var docDefinition = {
      content: [
        { text: 'REMINDER', style: 'header' },
        { text: new Date().getFullYear().toString(), alignment: 'right' },
        {image: await this.getBase64ImageFromURL(
          "assets/imgs/login.png"
        ), alignment: 'right'
        },

        { text: 'From', style: 'subheader' },
        { text: this.letterObj.from },

        { text: 'To', style: 'subheader' },
        this.letterObj.to,

        { text: this.letterObj.text, style: 'story', margin: [0, 20, 0, 20] },

        {
          ul: [
            'Bacon',
            'Rips',
            'BBQ',
          ]
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
        },
        subheader: {
          fontSize: 14,
          bold: true,
          margin: [0, 15, 0, 0]
        },
        story: {
          italic: true,
          alignment: 'center',
          width: '50%',
        }
      }
    }
    this.pdfObj = pdfMake.createPdf(docDefinition);
    console.log("PDF", this.pdfObj);
  }
  
 
  downloadPdf() {
    let options = {
      documentSize: 'A4',
      type: 'share',
      fileName: 'myFile.pdf'
    };  
  window['plugins'].pdf.fromData(document.getElementById('hy').innerHTML, options);
  
   /* if (window.hasOwnProperty('cordova')) {
      this.pdfObj.getBuffer((buffer) => {
        var blob = new Blob([buffer], { type: 'application/pdf' });
        // Save the PDF to the data Directory of our App
        this.file.writeFile(this.file.dataDirectory, 'myletter.pdf', blob, { replace: true }).then
          (fileEntry => {
            // Open the PDf with the correct OS tools
            this.fileOpener.open(this.file.dataDirectory + 'myletter.pdf', 'application/pdf');
          })
      });
    } else {
      // On a browser simply use download!
      console.log("TELECHARGEMENT");
      this.pdfObj.download();
    }
  }*/

}