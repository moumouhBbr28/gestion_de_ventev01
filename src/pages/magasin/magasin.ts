import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { BonLivraisonProvider } from '../../providers/bon-livraison/bon-livraison';
import { Storage } from '@ionic/storage';
import { diversProvider } from '../../providers/divers/divers';
import { Commande } from '../../models/Commande';
/**
 * Generated class for the MagasinPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-magasin',
  templateUrl: 'magasin.html',
})
export class MagasinPage {
  mag: string;
  data: any;
  serverURL: any;
  magasin = []
  ngMag:any;
  lesmagasins=[];
  magasins:any;
  devis_aj:Commande
  constructor(public navCtrl: NavController, public navParams: NavParams,

    public restApi: BonLivraisonProvider,
    public storage: Storage,
    public alertCtrl: AlertController,
    public BLApi:BonLivraisonProvider,
    public diversApi:diversProvider ) {
      this.devis_aj = {
        "NUMBON": null,
        "DATEBON": null,
        "CLIENT": null,
        "UTILISATEUR": null,
        "typevente_pardefaut": null,
        "PAIE": null,
        "REPRES": null,
        "VALIDE": null,
        "remisePrc": null,
        "remiseTaux": null,
        "DATE_BON_form": null,
        "refPiece": null
      };
  
      this.storage.get('name').then((val) => {

        this.ngMag = val;
      
        console.log('this.ngMag', this.ngMag);
  
        this.BLApi.getMagByCode(this.ngMag, this.serverURL).subscribe(
          res => {
            this.data = res;
  
            this.lesmagasins = this.data.return;
            console.log('lalala', this.lesmagasins)
          });
  
      });

    this.storage.get('ip_adr').then((val) => {
      this.serverURL = val;

    this.restApi.getAllMagasins(this.serverURL)
    .subscribe(
      res => {
        this.data = res;
        this.magasin = this.data.return;
        console.log('magasinssssssss:', this.magasin);

      });

      this.diversApi.getMagasins(this.serverURL).subscribe(
        resp => {
          this.data = resp;
          this.magasins = this.data.return;
        });
    })

    this.storage.get('name').then((val) => {

      this.devis_aj.refPiece = val;
      this.magasin = val.toString();
      console.log('val', this.magasin);

      this.BLApi.getMagByCode(this.devis_aj.refPiece, this.serverURL).subscribe(
        res => {
          this.data = res;

          this.lesmagasins = this.data.return;
          console.log('lalala', this.lesmagasins)
        });

    });
  }

  ionViewWillEnter() {
    this.getMagasins();
    this.storage.get('name').then((val) => {
      this.ngMag=val;
      console.log('Your name is', val);
    });
  }

  getMagasins() {
   
  }

  setInfo($mag) {

    this.storage.set('name', $mag);
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
}
