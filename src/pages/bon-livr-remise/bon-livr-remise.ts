import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { BonLivraisonProvider } from "../../providers/bon-livraison/bon-livraison";
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-bon-livr-remise',
  templateUrl: 'bon-livr-remise.html',
})
export class BonLivrRemisePage {
  nbon; totaux_bht; dta; data;
  prod_aj = {
    remise: null,
    taux: null
  };
  serverURL;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public cmdApi: BonLivraisonProvider,
    public alertCtrl: AlertController,
    public storage: Storage
  ) {
    this.storage.get('ip_adr').then((val) => {
      this.serverURL = val;
      this.nbon = this.navParams.data.c_proforma;
      this.totaux_bht = this.navParams.data.totaux_bht;
      this.cmdApi.getTypeVentSelCmd(this.nbon, this.serverURL).subscribe(
        res => {
          this.data = res;
          this.prod_aj.remise = this.data.return[0].TAUXREMISE;
          this.prod_aj.taux = this.data.return[0].MONTREMISE;
        });


    });

  }


  AppliquerRemise(prod_aj) {
    this.dta = {
      'NUMBON': this.nbon * 1,
      "TAUXREMISE": this.prod_aj.remise * 1,
      "MONTREMISE": this.prod_aj.taux * 1
    };
    this.cmdApi.majTauxRemise(this.dta, this.serverURL).subscribe(
      res => {
        this.data = res;
        let alert = this.alertCtrl.create({
          title: "Information",
          subTitle: this.data['msg'],
          buttons: ['OK']
        });
        alert.present();
        this.navCtrl.pop();
      });
     
  };
  remiseApp($remise_g) {
    if ($remise_g < 0 || $remise_g == null || isNaN($remise_g) || $remise_g > 100) {
      this.prod_aj.taux = 0;
    } else {
      if ($remise_g != 0) {
      this.prod_aj.taux = (this.totaux_bht * $remise_g) / 100;}

    }
  };
  getRemiseDepuisTaux($remise_g) {
    if ($remise_g < 0 || $remise_g == null || isNaN($remise_g)) {
      this.prod_aj.remise = 0;
    } else {
    
      //  this.prod_aj.remise = ((100 * $remise_g) / this.totaux_bht);
      

    }
  };
}
