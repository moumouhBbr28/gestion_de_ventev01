import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';



@Injectable()

export class ServerConfigProvider {
  SERVER = "http://192.168.100.221/php-back-end/";
  adressip;

  constructor(  public alertCtrl: AlertController ,  public storage: Storage) { 
     this.storage.get('ip').then((val) => {
      this.adressip = "192.168.100.221";
    });
    }

 
 
  setSever($value_ip):any{
    //recuperer
    this.SERVER = "http://"+$value_ip+"/php-back-end/";
    //garde en storage ou bdd
    // set a key/value
    this.storage.set('ip_adr', this.SERVER);
     this.storage.set('ip', $value_ip);
  }

 


}



