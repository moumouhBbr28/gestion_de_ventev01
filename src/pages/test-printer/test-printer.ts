import { Component } from '@angular/core';
import { File, IWriteOptions } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { NavController, NavParams } from 'ionic-angular';


import { jsPDF } from 'jspdf';
import domtoimage from 'dom-to-image';
import { PDFGenerator } from '@ionic-native/pdf-generator/ngx';
@Component({
  selector: 'page-test-printer',
  templateUrl: 'test-printer.html',
})
export class TestPrinterPage {

  element: any;
  content: any;
  couponPage: any;
  window: any;
  afficher = false;

  //  cordova:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private file: File, private fileOpener: FileOpener, private pdf: PDFGenerator) {
  }

  createPdf() {
    console.log("ibda")
    const pdfBlock = document.getElementById("print-wrapper");

    const options = {
      background: "white",
      height: pdfBlock.clientHeight,
      width: pdfBlock.clientWidth
    };
    var doc = new jsPDF("p", "mm", "a4");
    doc.html(pdfBlock, {
      callback: (doc) => {
       
        doc.output("dataurlnewwindow");
      }
    });
    domtoimage.toPng(pdfBlock, options).then((fileUrl) => {


      //  doc.addImage(fileUrl, 'PNG', 0, 0,0,0);

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

      this.file.checkFile(directory, fileName).then((res) => {
        this.file.writeFile(directory, fileName, buffer, options)
          .then((res) => {
            console.log("File generated" + JSON.stringify(res));
            this.fileOpener.open(this.file.dataDirectory + fileName, 'application/pdf')
              .then(() => console.log('File is exported'))
              .catch(e => console.log(e));
          }).catch((error) => {
            console.log(JSON.stringify(error));
          });
      }).catch((error) => {
        this.file.writeFile(directory, fileName, buffer, options).then((res) => {
          console.log("File generated" + JSON.stringify(res));
          this.fileOpener.open(this.file.dataDirectory + fileName, 'application/pdf')
            .then(() => console.log('File exported'))
            .catch(e => console.log(e));
        })
          .catch((error) => {
            console.log(JSON.stringify(error));
          });
      });
    }).catch(function (error) {
      console.error(error);
    });


  }


}
