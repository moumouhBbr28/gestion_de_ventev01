import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';


import { TabsPage } from '../tabs/tabs';

import { Device } from '@awesome-cordova-plugins/device/ngx';

import { Md5 } from 'ts-md5/dist/md5';
import { LgAccueilPage } from '../lg-accueil/lg-accueil';
import { StartPage } from '../start/start';
import { SplashScreen } from '@ionic-native/splash-screen';

declare var cordova: any;

@IonicPage()
@Component({
  selector: 'page-splash',
  templateUrl: 'splash.html',
})
export class SplashPage {

  UUID: any="";


  PRODUCT_KEY_S: string = "";
  NAME_CL_S: string="";
  message: string = "";
  key: string = "MSC";
  result: string = ""

  ordre: number;
  decalage: string;

  motdepasse: string = "";
  _separator: "-";


  constructor(    public splashScreen: SplashScreen,
    public navCtrl: NavController,
    public storage: Storage, private platform: Platform, public device: Device, public md5: Md5) {

    platform.ready().then(() => {
      setTimeout(() => {
        this.splashScreen.hide();
        }, 500)
  



     // this.UUID = JSON.stringify(this.device.uuid).replace(/\"/g, "");
         this.UUID = this.device.uuid;
  
        this.UUID= this.UUID.toUpperCase();
          console.log('',this.UUID.toUpperCase());
          this.storage.get('NAME_CL').then((disc) => {
          this.NAME_CL_S = disc;
     
          this.genrateKey(this.UUID, this.key);
          this.genrateKey(this.result, this.NAME_CL_S);
  
          this.changeOrdre(this.result);
  
        })


        //this.NAME_CL="ZOURDANI";




        this.storage.get('PRODUCT_KEY').then((disc) => {
          this.PRODUCT_KEY_S = disc;

          console.log("PRODUCT_KEY111", this.PRODUCT_KEY_S);
          if (this.PRODUCT_KEY_S == this.motdepasse) {
            console.log(`kifkif  :${this.PRODUCT_KEY_S}`);
            this.navCtrl.setRoot(LgAccueilPage);
  
          }else
          if (this.PRODUCT_KEY_S != this.motdepasse) {
            console.log("/" + this.motdepasse + "/" + "/" + this.PRODUCT_KEY_S + "/");
            this.navCtrl.setRoot(StartPage);
          }
        else if (this.PRODUCT_KEY_S == " " ||this.PRODUCT_KEY_S == null){
          this.navCtrl.setRoot(StartPage);
         }
        })

      

      }
    );

  }


  //Cryptage


  position(x) {
    this.ordre = x.charCodeAt(0) - 48;
  }

  decale(x, p) {
    var o: number;
    o = x.charCodeAt(0) + p;
    if (o > 90) {
      o = 48 + o - 91;
    }
    if ((o > 57) && (o < 65)) {
      o = o + 7;
    }
    this.decalage = String.fromCharCode(o);
  }

  genrateKey(message, key) {
    this.message = message;

    let resulat: string = "";
    let j: number;
    for (let i = 0; i < this.message.length; i++) {
      j = ((i) % (key.length));
      this.position(key[j]);

      this.decale(this.message[i], this.ordre)
      resulat = resulat + this.decalage;
    }
    this.result = resulat;
  }
  changeOrdre(res) {


    this.motdepasse = ""
    this.motdepasse = res[4] + res[3] + res[0] + res[7] + res[1] + res[6] + res[2] + res[5];
    this.motdepasse = this.motdepasse + res[12] + res[11] + res[8] + res[15] + res[9] + res[14] + res[10] + res[13]
    this.motdepasse = Md5.hashStr(this.motdepasse).toUpperCase();


  }





}
