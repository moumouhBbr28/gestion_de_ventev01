import { Component } from '@angular/core';
import { Device } from '@awesome-cordova-plugins/device/ngx';
import { AlertController, IonicPage, LoadingController, NavController, NavParams, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Md5 } from 'ts-md5';
import { TabsPage } from '../tabs/tabs';
import { LgAccueilPage } from '../lg-accueil/lg-accueil';

/**
 * Generated class for the StartPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-start',
  templateUrl: 'start.html',
})
export class StartPage {



    UUID: string="";
    NAME_CL: string = "";
    PRODUCT_KEY: string = "";
  
  
  
    message: string;
    key: string = "MSC"
    result: string = ""
  
    ordre: number;
    decalage: string;
  
    motdepasse: string;
    _separator: "-";
  
    constructor(public navCtrl: NavController,
      public navParams: NavParams,
      public alertCtrl: AlertController, private platform: Platform,
      public device: Device,
      public storage: Storage,
      public loadingCtrl: LoadingController,
    ) {
  
      platform.ready().then(() => {
  
        // UUID
        this.UUID = this.device.uuid //"D2DECAE8BA3BD499";
       
        this.UUID= this.UUID.toUpperCase();
   
       //console.log('sqdqs',this.UUID.toLocaleUpperCase());
     
        this.storage.get('NAME_CL').then((val) => {
          this.NAME_CL = val;
          console.log("cl:" + this.NAME_CL);
  
        });
        this.storage.get('PRODUCT_KEY').then((val) => {
  
          this.PRODUCT_KEY = val;
  
  
        });
  
  
      })
  
  
    }
  
  
    // GET UUID
  
    getUUID() {
      const confirm = this.alertCtrl.create({
        title: ' Empreinte Matériel ',
        message: this.UUID,
        buttons: [
  
          {
            text: 'OK',
            handler: () => {
              //  this.platform.exitApp()
            }
          }
        ]
      });
      confirm.present();
  
    }
  
    // FORMAT UUID
  
    format(valString) {
      if (!valString) {
        return '';
      }
      let val = valString.toString();
      const parts = val.replace(/ /g, '');
      return parts.replace(/\B(?=(?:\w{4})+(?!\w))/g, this._separator)
    };
  
  
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
      for (let i = 0; i < message.length; i++) {
        j = ((i) % (key.length));
        this.position(key[j]);
  
        this.decale(this.message[i], this.ordre)
        resulat = resulat + this.decalage;
      }
      this.result = resulat;
    }
  
    changeOrdre(res) {
  
      //AAAA-BBBB-CCCC-DDDD
      this.motdepasse = ""
      this.motdepasse = res[4] + res[3] + res[0] + res[7] + res[1] + res[6] + res[2] + res[5];
      this.motdepasse = this.motdepasse + res[12] + res[11] + res[8] + res[15] + res[9] + res[14] + res[10] + res[13]
     
  
     this.motdepasse = Md5.hashStr(this.motdepasse).toUpperCase();
    }
  
  
  
    goToSeConnecter(NAME_CL, PRODUCT_KEY) {
  
      this.NAME_CL = NAME_CL;
  
      this.PRODUCT_KEY = PRODUCT_KEY;
      //this.PRODUCT_KEY = this.PRODUCT_KEY.slice(0, 4) + this.PRODUCT_KEY.slice(5, 9) + this.PRODUCT_KEY.slice(10, 14) + this.PRODUCT_KEY.slice(15, 19) + this.PRODUCT_KEY.slice(20, 24) + this.PRODUCT_KEY.slice(25, 29) + this.PRODUCT_KEY.slice(30, 34) + this.PRODUCT_KEY.slice(35, 39);
      // this.PRODUCT_KEY=this.PRODUCT_KEY.split('-').join('');
  
      this.genrateKey(this.UUID, this.key);
      this.genrateKey(this.result, this.NAME_CL);
  
  
      this.changeOrdre(this.result);
  
      console.log(this.motdepasse);
  
  
      if (this.PRODUCT_KEY == this.motdepasse) {
  
        this.storage.set('NAME_CL', this.NAME_CL);
        this.storage.set('PRODUCT_KEY', this.PRODUCT_KEY);
  
        this.navCtrl.push(LgAccueilPage);
  
      } else {
        this.PRODUCT_KEY = "";
        const confirm = this.alertCtrl.create({
     
          message: "veuillez vérifier les informations saisies !!",
          buttons: [
  
            {
              text: 'OK',
              handler: () => {
                //  this.platform.exitApp()
              }
            }
          ]
        });
        confirm.present();
      }
  
    }
  
  }
  