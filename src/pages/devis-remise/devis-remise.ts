import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController } from 'ionic-angular';
import { DevisProvider} from "../../providers/devis/devis";
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-devis-remise',
  templateUrl: 'devis-remise.html',
})
export class DevisRemisePage {
  nbon ;totaux_bht;dta;data;
  prod_aj={
    remise: null,
    taux: null
  };
serverURL;
  constructor(public navCtrl: NavController, public navParams: NavParams,  
    public devisApi: DevisProvider,public alertCtrl:AlertController,
              public storage: Storage
              ){
               this.nbon = this.navParams.data.c_proforma;
               this.totaux_bht =this.navParams.data.totaux_bht;
               this.storage.get('ip_adr').then((val) => {
               this.serverURL = val;
                

                this.devisApi.getTypeVentSelDevis(this.nbon,this.serverURL).subscribe(
                  res => {
                    this.data = res;
                    this.prod_aj.remise = this.data.return[0].TAUXREMISE;
                    this.prod_aj.taux = this.data.return[0].MONTREMISE;
                  });
    
                });
    
  }


  AppliquerRemise(prod_aj){
   this.dta = {
     'NUMBON': this.nbon * 1,
     "TAUXREMISE": this.prod_aj.remise * 1,
     "MONTREMISE": this.prod_aj.taux * 1
   };
    this.devisApi.majTauxRemise(this.dta,this.serverURL).subscribe(
      res => {
        this.data = res;
        let alert = this.alertCtrl.create({
          title: "Information",
          subTitle:  this.data['msg'],
          buttons: ['OK']
        });
        alert.present();
      });
  };
  remiseApp($remise_g) {
    if ($remise_g <= 0 || $remise_g == null || isNaN($remise_g) || $remise_g > 100) {
      this.prod_aj.taux = 0;
    } else {
      this.prod_aj.taux =  (this.totaux_bht * $remise_g) / 100;
    }
  };
  getRemiseDepuisTaux($remise_g){
    if ($remise_g <= 0 || $remise_g == null || isNaN($remise_g)) {
      this.prod_aj.remise = 0;
    } else {
     // this.prod_aj.remise =  ((100*$remise_g)/this.totaux_bht);

    }
  };
}
