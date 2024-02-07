import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController,LoadingController } from 'ionic-angular';
import { DevisProvider } from "../../providers/devis/devis";
import { produitDevis } from "../../models/produitDevis";
import { ProduitsProvider } from "../../providers/produits/produits";
import 'rxjs/add/operator/map';

import { BonLivraisonProvider } from "../../providers/bon-livraison/bon-livraison";
import {BonLivrDataPage} from "../bon-livr-data/bon-livr-data";
import {StockProvider} from "../../providers/stock/stock";
import { Storage } from '@ionic/storage';
import { Subscription } from 'rxjs';
import { BarcodeScanner, BarcodeScannerOptions } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { IonicSelectableComponent } from 'ionic-selectable';

@IonicPage()
@Component({
  selector: 'page-bon-livr-edit-produit',
  templateUrl: 'bon-livr-edit-produit.html',
})
export class BonLivrEditProduitPage {
  users = []
  $size = 15;
  $skip = 0;
  mag:any;

  produits: any;
  data;datax:any;
  prod_aj: produitDevis;
  P_VENT1HT :any;
  P_VENT2HT :any;
  PRIX_VENT3:any;
  PRIX_VENT4:any;
  PRIX_VENT5:any;
  P_DISTHT:any;
  dataresp; 
  Q_STOCK;
  serverURL;


  
  scannedData: any;
  encodedData: '';
  encodeData: any;
  inputData: any;
bl_data:BonLivrDataPage;
  
  prodSubscription: Subscription;
  searchString = "";
  skip_search = 0;
  hasData = 1; //Pour verifier le chargmnt de données
  searchMode = false; //Pour la recherche
  numTimesLeft = 5;
  isScanned=false;
  EQUIV:any;
  scanned:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public devisApi: DevisProvider,
              public produitsApi: ProduitsProvider  ,
              public stockApi: StockProvider,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              public cmdApi: BonLivraisonProvider,
              public storage: Storage,
              public barcodeScanner: BarcodeScanner) {
     this.prod_aj = {
          "NUMBON":null,
          "d_prod":null,
          "LIGNE":null,
          "qte": "1",
          "remise":"0",
          "totalHt": "0",
          "totalNetHt": "0",
          "TVA":"0",
          "taux_tva": null,
          "totalTTC": null,
          "tauxRemise": null,
          "PUHT": null,
          "PUHT_formate":null,
          "ordre":null,
          "VALIDE": "0"
        };
       this.storage.get('ip_adr').then((val) => {
        this.serverURL = val;

       
        this.produitsApi.getAllProduits2(this.navParams.data.$LIGNE, this.serverURL).subscribe(
          res => {
            this.data = res;
            this.produits = this.data.return;
            console.log('premier', this.produits);
  
  
  
          });
        this.prod_aj.NUMBON = this.navParams.data.$NUMBON;
  
        this.prod_aj.ordre = this.navParams.data.$ORDRE;
        this.getdetailsProduit();
      });

      
    this.storage.get('name').then((val) => {

      this.mag = val; });

  
  }


  chargerDataApi($skip, $size) {
    this.produitsApi.getUsers($skip, $size, this.serverURL)
      .subscribe(
        res => {

          this.data = res;

          if ($skip == 0) {
            this.produits = this.data.return;


          } else {
            for (let i = 0; i < this.data.return.length; i++) {
              this.produits.push(this.data.return[i]);

            }
          }
          // this.produits = this.data.return;

          console.log('a', this.produits);
        });
  }



  getNewProducts($search, $skip_search, $size) {
    this.produitsApi.GetFeedSearching1($search, $skip_search, $size, this.serverURL).subscribe(
      res => {

        this.data = res;


        // this.produits = this.data.return;
        for (let i = 0; i < this.data.return.length; i++) {
          this.produits.push(this.data.return[i]);

        }

      });
  }


  search_php(event: {
    component: IonicSelectableComponent,
    text: string
  }) {
    let search = event.text.trim().toLowerCase();


    if (this.prodSubscription) {
      this.prodSubscription.unsubscribe();
    }

    // this.chargerDataApi(this.$skip, this.$size);

    if (search != "" && search != null) {

      this.skip_search = 0;

      this.produitsApi.GetFeedSearching1(search, this.skip_search, this.$size, this.serverURL).subscribe(
        res => {

          this.data = res;

          this.produits = this.data.return;


          event.component.items = this.produits
          console.log('prd', this.produits)
        });

    }

    if (!search) {
      // // Close any running subscription.
      if (this.prodSubscription) {
        this.prodSubscription.unsubscribe();

      }

      // this.chargerDataApi(this.$skip, this.$size);
      //  event.component.endInfiniteScroll();

      this.$skip = 0;

      this.produitsApi.getAllProduits2(this.navParams.data.$LIGNE, this.serverURL).subscribe(
        res => {
          this.data = res;
          this.produits = this.data.return;
          console.log('prod', this.produits);

        });

    }


    event.component.enableInfiniteScroll();
  }


  loadMore(event: {
    component: IonicSelectableComponent,
    text: string
  }) {



    let search = event.text.trim().toLowerCase();


    setTimeout(() => {
      event.component.scrollToBottom().then(() => {
        console.log('Scroll completed.');


        if (search != "") {

          this.skip_search = this.skip_search + this.$size;

          console.log('b', search, 'skip', this.skip_search, 'size', this.$size);

          //this.getNewProducts(search, this.skip_search, this.$size);
          this.produitsApi.GetFeedSearching1(search, this.skip_search, this.$size, this.serverURL).subscribe(
            res => {

              this.data = res;

              for (let i = 0; i < this.data.return.length; i++) {
                this.produits.push(this.data.return[i]);
              }


              // event.component.items = this.produits
              console.log('prd1', this.produits)
            });

          if (this.data.return.length < this.$size) {
            event.component.disableInfiniteScroll();
          }
          event.component.endInfiniteScroll();
        } else {

          this.$skip = this.$skip + this.$size;

          // this.chargerDataApi(this.$skip, this.$size);

          this.produitsApi.getUsers(this.$skip, this.$size, this.serverURL)
            .subscribe(
              res => {

                this.data = res;

                for (let i = 0; i < this.data.return.length; i++) {
                  this.produits.push(this.data.return[i]);

                }


                console.log('a', this.produits);
              });

          event.component.endInfiniteScroll();

        }




      }).catch(() => { console.log('errr'); });






    }, 500);
  }


  onClear(event: {
    component: IonicSelectableComponent,
    items: any[]
  }) {
    this.$skip = 0;
    this.produits = [];
    this.produitsApi.getUsers(this.$skip, this.$size, this.serverURL)
      .subscribe(
        res => {

          this.data = res;


          this.produits = this.data.return;



          // this.produits = this.data.return;

          console.log('clear', this.produits);
        });


    event.component.enableInfiniteScroll();
  }
  onClose(event: { component: IonicSelectableComponent }) {
    this.$skip = 0;
    this.skip_search = 0;
    console.log('skip onOpen', this.$skip);
    this.produitsApi.getAllProduits2(this.prod_aj.d_prod, this.serverURL).subscribe(
      res => {
        this.data = res;
        this.produits = this.data.return;
        console.log('on close', this.produits);



      });

  }

  scanBarcode() {
    const options: BarcodeScannerOptions = {
      preferFrontCamera: false,
      showFlipCameraButton: true,
      showTorchButton: true,
      torchOn: false,
      prompt: 'Place a barcode inside the scan area',
      resultDisplayDuration: 500,
      formats: 'EAN_13,EAN_8,QR_CODE,PDF_417,CODE_128 ',
      orientation: 'portrait',
    };

    this.barcodeScanner.scan(options).then(barcodeData => {
      console.log('Barcode data', barcodeData);
      this.scannedData = barcodeData["text"];
      this.isScanned = false;

      this.produitsApi.getProdByReqequiv(this.scannedData, this.serverURL)
      .subscribe(
        res => {
          this.scanned = res['count'];
                 if (this.scanned == 0) {
            let alert = this.alertCtrl.create({
              title: "Erreur",
              subTitle: 'le produit n\'existe pas !!',
              buttons: ['OK']
            });
            alert.present()
          }
      
          this.data = res;
          this.EQUIV = this.data.return[0].LIGNE;
      
          this.produitsApi.getAllProduits3(this.EQUIV, this.serverURL).subscribe(
            res => {
              this.data = res;
              this.produits = this.data.return;
    
            })
    
          this.getPuhtProd(this.EQUIV, 1, 0);
   
      });

    }).catch(err => {

    });
  }
  async getdetailsProduit(){

    await   this.cmdApi.getProduitcommandes_clients( this.prod_aj.NUMBON, 
      this.prod_aj.ordre ,  this.serverURL).subscribe(
      resps => {
        this.data =resps;
        this.prod_aj = {
          "NUMBON":this.navParams.data.$NUMBON,
          "d_prod":this.data.return[0].LIGNE,
          "LIGNE":this.data.return[0].C_PRODUIT,
          "qte":  parseInt(this.data.return[0].QTE),
          "remise":this.data.return[0].REMISE,
          "totalHt": "0",
          "totalNetHt": "0",
          "TVA":this.data.return[0].TVA,
          "taux_tva": null,
          "totalTTC": null,
          "tauxRemise": null,
          "PUHT": parseFloat(this.data.return[0].PUHT),
          "PUHT_formate":null,
          "ordre":this.navParams.data.$ORDRE,
          "VALIDE": "0"
        };
        this.prod_aj.PUHT_formate = new Intl.NumberFormat().format(this.prod_aj.PUHT); //juste pour l'affichage

      });
  }



  async localgetTypeVentSelDevis($c_prod,$qtes,$remise,data$){
    await this.cmdApi.getTypeVentSelCmd(this.prod_aj.NUMBON ,  this.serverURL).subscribe(
      resp => {
        this.dataresp = resp;
        var TYPEVENTE = this.dataresp.return[0].TYPEVENTES;
        if (TYPEVENTE == '1'){
          this.prod_aj.PUHT = data$.P_VENT1HT;
        } else{
          if (TYPEVENTE == '2'){
            this.prod_aj.PUHT = data$.P_VENT2HT;
          } else{
            if (TYPEVENTE == '3'){
              this.prod_aj.PUHT = data$.PRIX_VENT3;
            } else{
              if (TYPEVENTE == '4'){
                this.prod_aj.PUHT = data$.PRIX_VENT4;
              } else{
                if (TYPEVENTE == '5'){
                  this.prod_aj.PUHT = data$.PRIX_VENT5;
                } else{
                  if (TYPEVENTE == 'D'){
                    this.prod_aj.PUHT = data$.P_DISTHT;
                  }
                }
              }
            }
          }
        }

        this.prod_aj.PUHT_formate = new Intl.NumberFormat().format(this.prod_aj.PUHT);
        //juste pour l'affichage

        this.prod_aj.totalHt    =  $qtes * this.prod_aj.PUHT;
        this.prod_aj.totalNetHt =  this.prod_aj.totalHt;
        if($remise <= 0 || $remise == null || isNaN($remise) ||$remise > 100 ) {
          this.prod_aj.tauxRemise = "0";
        } else{
          this.prod_aj.tauxRemise =  (this.prod_aj.totalHt*$remise)/100;
          this.prod_aj.totalNetHt =  this.prod_aj.totalHt - this.prod_aj.tauxRemise;
        }
        this.prod_aj.taux_tva =  (this.prod_aj.totalNetHt*this.prod_aj.TVA)/100;
        this.prod_aj.totalTTC =  this.prod_aj.totalNetHt  +   this.prod_aj.taux_tva;
      });

  };
  async  getQteEnStock($c_prod){
    await this.stockApi.getQteByCodeProd($c_prod ,this.mag,  this.serverURL).subscribe(
      res => {
        try {
          this.data = res;
        this.Q_STOCK = this.data.return[0].Q_STOCK;
        console.log('STOCK:   ', this.data);
        } catch (error) {
          this.Q_STOCK=0;
        }
      });

      
  }

  async localgetPuhtProd($c_prod,$qtes,$remise){
    await  this.devisApi.getPuhtProdProvider($c_prod ,  this.serverURL).subscribe(
      res => {
        this.isScanned = true;
        this.datax = res;

        this.prod_aj.d_prod =  this.datax.return[0].D1_PROD;
        this.P_VENT1HT =  this.datax.return[0].P_VENT1HT;
        this.P_VENT2HT =  this.datax.return[0].P_VENT2HT;
        this.PRIX_VENT3 =  this.datax.return[0].PRIX_VENT3;
        this.PRIX_VENT4 =  this.datax.return[0].PRIX_VENT4;
        this.PRIX_VENT5 =  this.datax.return[0].PRIX_VENT5;
        this.P_DISTHT =  this.datax.return[0].P_DISTHT;
        this.prod_aj.TVA =  this.datax.return[0].TVA*1;
        this.localgetTypeVentSelDevis($c_prod,$qtes,$remise,this.datax.return[0]);

      });
    this.getQteEnStock($c_prod);
  }

  getPuhtProd ($c_prod,$qtes,$remise){
    let loading = this.loadingCtrl.create({
      content: 'Calculs en cours ...'
    });
    loading.present();
    this.localgetPuhtProd($c_prod  ,$qtes,$remise);
    loading.dismiss();
  };


  async postProdDevis(devis$){
    await this.cmdApi.updateProduitcommandes_clients(devis$ ,  this.serverURL)
      .subscribe(res => {
        let alert = this.alertCtrl.create({
          title: "Information",
          subTitle: res['msg'],
          buttons: ['OK']
        });
        alert.present();
        this.bl_data.refresh_list_DPRO();
       // this.navCtrl.push(BonLivrDataPage, devis$.NUMBON);
      
      }, (err) => { console.log(err); });
  }


  modifierdetails ($prod_aj) {
    if($prod_aj.d_prod == null){
      let alert = this.alertCtrl.create({
        title: "Information",
        subTitle: "Veuillez saisir un produit à modifier !",
        buttons: ['OK']
      });
      alert.present();

    }else {
      let alert = this.alertCtrl.create({
        title: 'Confirmation',
        message: 'Etes vous sûr de modifier ce produit ?',
        buttons: [
          {  text: 'Non',  role: 'cancel' },
          {
            text: 'Oui',
            handler: () => {
              let loading = this.loadingCtrl.create({
                content: 'Opération en cours ...'
              });
              loading.present();
              this.postProdDevis($prod_aj); //insert
              
              this.navCtrl.pop();
              loading.dismiss();
            }
          }
        ]
      });
      alert.present();
    }
  }
}