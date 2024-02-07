import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginPage } from "../login/login";
import { RegisterPage } from "../register/register";
import { ServerConfigPage } from "../server-config/server-config";


@IonicPage()
@Component({
  selector: 'page-lg-accueil',
  templateUrl: 'lg-accueil.html',
})
export class LgAccueilPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) { }

  goToLogin() {
    this.navCtrl.setRoot(LoginPage);
  }
  goToRegister() {
    this.navCtrl.setRoot(RegisterPage);
  }

  goToConfigServer(){
	this.navCtrl.push(ServerConfigPage);	
  }
}
