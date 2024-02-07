import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TooltipsModule } from 'ionic-tooltips';


import { HttpClientModule } from '@angular/common/http';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ServerConfigPage } from '../pages/server-config/server-config';

/*======================= providers ==================== */
import { ProduitsProvider } from "../providers/produits/produits";
import { diversProvider } from '../providers/divers/divers';
import { DevisProvider } from '../providers/devis/devis';
import { StockProvider } from '../providers/stock/stock';
import { ClientsProvider } from '../providers/clients/clients';
import { CommandesProvider } from '../providers/commandes/commandes';

import { ServerConfigProvider } from '../providers/server-config/server-config';
import { ReglementsProvider } from '../providers/reglements/reglements';
import { ConversionProvider } from '../providers/conversion/conversion';
import { LoginProvider } from '../providers/login/login';
import { BonLivraisonProvider } from '../providers/bon-livraison/bon-livraison';
import { FactureVenteProvider } from '../providers/facture-vente/facture-vente';



import { TabsPage } from "../pages/tabs/tabs";
import { ContactPage } from '../pages/contact/contact';
import { ProduitsPage } from '../pages/produits/produits';
import { StockPage } from '../pages/stock/stock';
import { ReglementsPage } from "../pages/reglements/reglements";

import { ClientsPage } from '../pages/clients/clients';
import { ClientFichePage } from "../pages/client-fiche/client-fiche";
import { ClientAjoutPage } from "../pages/client-ajout/client-ajout";

import { DevisPage } from "../pages/devis/devis";
import { DevisDataPage } from "../pages/devis-data/devis-data";
import { DevisAjoutPage } from "../pages/devis-ajout/devis-ajout";
import { DevisAjoutProduitPage } from "../pages/devis-ajout-produit/devis-ajout-produit";
import { DevisEditProduitPage } from "../pages/devis-edit-produit/devis-edit-produit";
import { DevisRemisePage } from "../pages/devis-remise/devis-remise";


import { CommandesPage } from '../pages/commandes/commandes';
import { CommandesAjoutPage } from '../pages/commandes-ajout/commandes-ajout';
import { CommandesDataPage } from '../pages/commandes-data/commandes-data';
import { CommandesAjoutProduitPage } from '../pages/commandes-ajout-produit/commandes-ajout-produit';
import { CommandesEditProduitPage } from "../pages/commandes-edit-produit/commandes-edit-produit";
import { CommandesRemisePage } from "../pages/commandes-remise/commandes-remise";

import { BonLivrPage } from '../pages/bon-livr/bon-livr';
import { BonLivrAjoutPage } from '../pages/bon-livr-ajout/bon-livr-ajout';
import { BonLivrAjoutProduitPage } from '../pages/bon-livr-ajout-produit/bon-livr-ajout-produit';
import { BonLivrDataPage } from '../pages/bon-livr-data/bon-livr-data';
import { BonLivrRemisePage } from '../pages/bon-livr-remise/bon-livr-remise';
import { BonLivrEditProduitPage } from '../pages/bon-livr-edit-produit/bon-livr-edit-produit';

import {  LgAccueilPage } from "../pages/lg-accueil/lg-accueil";
import {  LoginPage } from "../pages/login/login";
import {  RegisterPage } from "../pages/register/register";

import { FactvPage } from '../pages/factv/factv';
import { FactvAjoutPage } from "../pages/factv-ajout/factv-ajout";
import { FactvDataPage } from "../pages/factv-data/factv-data";
import { FactvAjoutProduitPage } from "../pages/factv-ajout-produit/factv-ajout-produit";
import { FactvEditProduitPage } from "../pages/factv-edit-produit/factv-edit-produit";
import { FactvRemisePage } from "../pages/factv-remise/factv-remise";

import { SQLite } from '@ionic-native/sqlite';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { PDFGenerator } from '@ionic-native/pdf-generator/ngx';
import { TestPrinterPage } from '../pages/test-printer/test-printer';
import { CreancePage } from '../pages/creance/creance';
import { CreanceClientProvider } from '../providers/creance-client/creance-client';
import { BonLivrTotauxPage } from '../pages/bon-livr-totaux/bon-livr-totaux';

import { Device } from '@awesome-cordova-plugins/device/ngx';
import {Md5} from 'ts-md5/dist/md5';
import { StartPage } from '../pages/start/start';
import { SplashPage } from '../pages/splash/splash';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { IonicSelectableModule } from 'ionic-selectable';
import { MagasinPage } from '../pages/magasin/magasin';
import { Network } from '@ionic-native/network';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ProduitsPage,
    ServerConfigPage,
    ContactPage,
    StockPage,
    ClientsPage,
    ClientFichePage,
    ClientAjoutPage,
    CreancePage,
    DevisPage,
    DevisAjoutPage,
    DevisAjoutProduitPage,
    DevisDataPage,
    DevisEditProduitPage,
    DevisRemisePage,
    CommandesPage,
    CommandesAjoutPage,
    CommandesAjoutProduitPage,
    CommandesDataPage,
    CommandesEditProduitPage,
    CommandesRemisePage,
    BonLivrPage,
    BonLivrAjoutPage,
    BonLivrAjoutProduitPage,
    BonLivrDataPage,
    BonLivrEditProduitPage,
    BonLivrRemisePage,
    BonLivrTotauxPage,
    FactvPage,
    FactvAjoutPage,
    FactvDataPage,
    FactvAjoutProduitPage,
    FactvEditProduitPage,
    FactvRemisePage,
    TabsPage,
    ReglementsPage,
    SplashPage,
    StartPage,
    LgAccueilPage,
    LoginPage,
    RegisterPage,
    TestPrinterPage,
    MagasinPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    TooltipsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    IonicSelectableModule,

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ProduitsPage,
    ServerConfigPage,
    ContactPage,
    StockPage,
    ClientsPage,
    ClientFichePage,
    ClientAjoutPage,
    DevisPage,
    DevisAjoutPage,
    DevisAjoutProduitPage,
    DevisDataPage,
    DevisEditProduitPage,
    DevisRemisePage,
    CommandesPage,
    CommandesAjoutPage,
    CommandesAjoutProduitPage,
    CommandesDataPage,
    CommandesEditProduitPage,
    CommandesRemisePage,
    CreancePage,
    BonLivrPage,
    BonLivrAjoutPage,
    BonLivrAjoutProduitPage,
    BonLivrDataPage,
    BonLivrEditProduitPage,
    BonLivrRemisePage,
    BonLivrTotauxPage,
    FactvPage,
    FactvAjoutPage,
    FactvDataPage,
    FactvAjoutProduitPage,
    FactvEditProduitPage,
    FactvRemisePage,
    TabsPage,
    ReglementsPage,
    SplashPage,
    StartPage,
    LgAccueilPage,
    LoginPage,
    RegisterPage,
    TestPrinterPage,
    MagasinPage

  ],
  providers: [
    StatusBar,
    SplashScreen,
    SQLite,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ProduitsProvider,
    StockProvider,
    ClientsProvider,
    diversProvider,
    DevisProvider,
    CommandesProvider,
    BonLivraisonProvider,
    FactureVenteProvider,
    ServerConfigProvider,
    ReglementsProvider,
    ConversionProvider,
    LoginProvider ,
    FileOpener,
    File,
    PDFGenerator,
    CreanceClientProvider,
    Device,
    Md5,
    BarcodeScanner,

    Network
   
  ]
})
export class AppModule { }
