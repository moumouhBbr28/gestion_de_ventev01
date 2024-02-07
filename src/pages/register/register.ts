import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , AlertController , LoadingController } from 'ionic-angular';
import { LoginPage } from "../login/login";
import { LoginProvider } from "../../providers/login/login";
import { TabsPage } from "../tabs/tabs";
import { Storage } from '@ionic/storage';

import { ServerConfigPage } from "../server-config/server-config";


@IonicPage() 
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
 register_data = {
   "username" : null,
   "password" : null,
   "email" : null,
   "tel" : null,
   "password2": null
 };
 serverURL;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public loginApi: LoginProvider ,
              public alertCtrl:AlertController,
              public loadingCtrl:LoadingController,
              public storage: Storage
              ){
               this.storage.get('ip_adr').then((val) => {
                  this.serverURL = val;
                });
}

  public type = 'password';
  public type2 = 'password';

  public showPass = false;
  public showPass2 = false;

  showPassword() {
    this.showPass = !this.showPass;
    if(this.showPass){
      this.type = 'text';
    } else {
      this.type = 'password';
    }
  }

  showPassword2() {
    this.showPass2 = !this.showPass2;
    if(this.showPass2){
      this.type2 = 'text';
    } else {
      this.type2 = 'password';
    }
  }
  goToLogin(){
    this.navCtrl.push(LoginPage);
  }

  inscription(data){
    this.inserpServ(data);
  };

  datas;msgError;
  async inserpServ($data){
    //password au moin 4 caracteres jusqu a 20
    //username au moin 3 caracteres jusqu a 20
    //tel au moin 3 caracteres jusqu a 20

    this.loginApi.inscription($data,this.serverURL).subscribe(
      res => {
        this.datas = res;
        console.log(this.datas);
        if(this.datas['success']){
          let alert = this.alertCtrl.create({
            title: "Information",
            subTitle: this.datas['msg'],
            buttons: [{
              text: 'OK',
              handler: () => {
                this.navCtrl.setRoot(TabsPage);
              }
            }]
          });
          alert.present();

        }else{
          let alert = this.alertCtrl.create({
            title: "Erreur",
            subTitle: this.datas['msg'],
            message: this.datas['m'],
            buttons: [{
              text: 'OK',
              handler: () => { }
            }]
          });
          alert.present();
        }
      } ,error=> {
        this.msgError = error;
        let alert = this.alertCtrl.create({
          title: "Erreur",
          subTitle: "Vérifiez la configuration de votre serveur ",
          buttons: [{
            text: 'OK',
            handler: () => { }
          }]
        });
        alert.present();});
  }


  goToConfigServer(){
  this.navCtrl.push(ServerConfigPage);  
  }
}
