import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { BonLivraisonProvider } from '../../providers/bon-livraison/bon-livraison';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the BonLivrTotauxPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-bon-livr-totaux',
  templateUrl: 'bon-livr-totaux.html',
})
export class BonLivrTotauxPage {
  numBon: Object;
  data: any;
  totaux:any;
  serverURL;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public cmdApi: BonLivraisonProvider,
    public storage: Storage,
    public viewCtrl: ViewController) {
    this.numBon = this.navParams.get('numBon');
    this.storage.get('ip_adr').then((val) => {
      this.serverURL = val;
      // this.cmdApi.get_detail_totaux(this.numBon, this.serverURL).subscribe(
      //   res => {
      //     this.data = res;
      //     this.totaux = this.data.return;
  
        
      //     console.log('data', this.totaux)
      //   });


    });
   
   
  }

  ionViewWillEnter(){
    this.loadTotaux();
  }
 
  dismiss() {
 
    this.viewCtrl.dismiss();
  }

  loadTotaux() {
    this.cmdApi.get_detail_totaux(this.numBon, this.serverURL).subscribe(
      res => {
        this.data = res;
        this.totaux = this.data.return;

      
        console.log('data', this.totaux)
      });
  }
}
