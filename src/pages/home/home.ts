import { Component } from '@angular/core';
import { NavController , App } from 'ionic-angular';
import { Storage } from '@ionic/storage';


import { ProduitsPage } from '../produits/produits';
import { ContactPage } from "../contact/contact";
import { StockPage } from "../stock/stock";
import { ClientsPage } from "../clients/clients";
import { DevisPage } from "../devis/devis";
import { CommandesPage } from '../commandes/commandes';
import { BonLivrPage } from '../bon-livr/bon-livr';
import { FactvPage } from "../factv/factv";
import { LgAccueilPage } from "../lg-accueil/lg-accueil";
import { LoginProvider } from "../../providers/login/login";
import { CreancePage } from '../creance/creance';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  constructor(public navCtrl: NavController,
              public storage: Storage,
              public loginApi: LoginProvider ,
              private app:App) {


  }
  goToProduits() {
    this.navCtrl.push(ProduitsPage);
  }
  goToContact() {
    this.navCtrl.push(ContactPage);
  }
  goToStock() {
    this.navCtrl.push(StockPage);
  }
  goToClients(){
    this.navCtrl.push(ClientsPage);
  }
  goToDevis(){
    this.navCtrl.push(DevisPage);
  }
  goToCommandes(){
    this.navCtrl.push(CommandesPage);
  }

  goToLivraisonBon(){
    this.navCtrl.push(BonLivrPage);
  }
  goToFactureVente(){
    this.navCtrl.push(FactvPage);
  }
  goToCreance(){
    this.navCtrl.push(CreancePage);
  }
  logout(){
    this.app.getRootNav().setRoot(LgAccueilPage);
  }

}
