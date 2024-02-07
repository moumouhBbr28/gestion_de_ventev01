import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, App } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { ServerConfigPage } from '../pages/server-config/server-config';
import { HomePage } from '../pages/home/home';
import { ProduitsPage } from '../pages/produits/produits';
import { StockPage } from '../pages/stock/stock';
import { ContactPage } from "../pages/contact/contact";
import { ClientsPage } from "../pages/clients/clients";
import { DevisPage } from "../pages/devis/devis";
import { CommandesPage } from '../pages/commandes/commandes';
import { BonLivrPage } from '../pages/bon-livr/bon-livr';
import { FactvPage } from "../pages/factv/factv";
import { LgAccueilPage } from "../pages/lg-accueil/lg-accueil";
import { LoginPage } from "../pages/login/login";
import { RegisterPage } from "../pages/register/register";
import { LoginProvider } from "../providers/login/login";

import { TabsPage } from "../pages/tabs/tabs";
import { TestPrinterPage } from '../pages/test-printer/test-printer';
import { StartPage } from '../pages/start/start';
import { SplashPage } from '../pages/splash/splash';
import { FactvAjoutPage } from '../pages/factv-ajout/factv-ajout';
import { MagasinPage } from '../pages/magasin/magasin';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  
 
  rootPage:any = LgAccueilPage; 
//rootPage: any = FactvPage;
 // rootPage: any = SplashPage;
  pages: Array<{ title: string, component: any }>;

  constructor(public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public loginApi: LoginProvider,
    private app: App) {

    platform.ready().then(() => {
      this.pages = [
        { title: 'Accueil', component: HomePage },
        { title: 'Produits', component: ProduitsPage },
        { title: 'Stock', component: StockPage },
        { title: 'Clients', component: ClientsPage },
        { title: 'Proformas', component: DevisPage },
        { title: 'Commandes', component: CommandesPage },
        { title: 'Factures de vente', component: FactvPage },
        { title: 'Bons de livraison', component: BonLivrPage },
        { title: 'Contact', component: ContactPage },
        { title: 'Options', component: MagasinPage }
      ];
      statusBar.styleDefault();
      setTimeout(() => {
        this.splashScreen.hide();
        }, 500)
  
    });
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }

  logout() {
    this.app.getRootNav().setRoot(LgAccueilPage);
  }

  goToConfigServer() {
    this.nav.push(ServerConfigPage);
  }

}
