import { Component } from '@angular/core';
import {
  IonicPage, NavController, NavParams, AlertController,
  LoadingController
} from 'ionic-angular';
import { Devis } from "../../models/Devis";
import { diversProvider } from "../../providers/divers/divers";
import { DevisProvider } from "../../providers/devis/devis";

import { ClientsProvider } from "../../providers/clients/clients";
import { DevisAjoutProduitPage } from "../devis-ajout-produit/devis-ajout-produit";
import moment from 'moment';
import { Storage } from '@ionic/storage';
import { Subscription } from 'rxjs';
import { IonicSelectableComponent } from 'ionic-selectable';


@IonicPage()

@Component({
  selector: 'page-devis-ajout',
  templateUrl: 'devis-ajout.html',
})

export class DevisAjoutPage {
  $size = 15;
  $skip = 0;

  devis_aj: Devis;
  dueDate: any;
  data: any;
  numBon: any;
  clients: any;
  typevente: any;
  modePayement: any;
  REPRES: any;
  modeTarif;
  serverURL;

  prodSubscription: Subscription;
  searchString = "";
  skip_search = 0;
  hasData = 1; //Pour verifier le chargmnt de données
  searchMode = false; //Pour la recherche
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public diversApi: diversProvider,
    public clientsApi: ClientsProvider,
    public devisApi: DevisProvider,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController, public storage: Storage
  ) {
    this.devis_aj = {
      "NUMBON": null,
      "DATEBON": null,
      "CLIENT": null,
      "UTILISATEUR":null,
      "typevente_pardefaut": null,
      "PAIE": null,
      "REPRES": null,
      "VALIDE": null,
      "remisePrc": null,
      "remiseTaux": null,
      "DATE_BON_form": null

    };

    this.storage.get('user').then((val) => {

      this.devis_aj.UTILISATEUR= val;
       console.log('utilisateur',this.devis_aj.UTILISATEUR)
     });
    this.storage.get('ip_adr').then((val) => {
      this.serverURL = val;

        this.clientsApi.getUsers(this.$skip, this.$size, this.serverURL).subscribe(
        res => {

          this.data = res;
          this.clients = this.data.return;

        });
      this.diversApi.getTarifs(this.serverURL).subscribe(
        res => {
          this.data = res;
          this.typevente = this.data.return;
        });

      this.diversApi.getCommercials(this.serverURL).subscribe(
        res => {
          this.data = res;
          this.REPRES = this.data.return;
        });

      this.diversApi.getModePaie(this.serverURL).subscribe(
        res => {
          this.data = res;
          this.modePayement = this.data.return;
        });



      this.devis_aj.DATEBON = moment(new Date(this.devis_aj.DATEBON).toISOString()).format('DD/MM/YYYY');

      this.devisApi.getLastNumBon(this.serverURL).subscribe(
        resp => {
          this.numBon = resp;
          this.devis_aj.NUMBON = this.numBon[0].MAX * 1 + 1;
        });

      this.paie_typevente_reinit();


    });


  }

  // async chargerDataApi($skip, $size) {
  //   this.clientsApi.getUsers($skip, $size, this.serverURL)
  //     .subscribe(
  //       res => {

  //         this.data = res;

  //         if ($skip == 0) {
  //           this.clients = this.data.return;


  //         } else {
  //           for (let i = 0; i < this.data.return.length; i++) {
  //             this.clients.push(this.data.return[i]);

  //           }
  //         }


  //         console.log('a', this.clients);
  //       });
  // }

  async paie_typevente_reinit() {
    await this.clientsApi.getEntete(this.serverURL).subscribe(res => {
      this.data = res;
      this.devis_aj.PAIE = this.data[0].MODEDEF;
      if (this.devis_aj.PAIE == null) {
        this.devis_aj.PAIE = "RECEP";
      }
      this.modeTarif = this.data[0].TARIFDEF;
      if (this.modeTarif == "" || this.modeTarif == null) {
        this.modeTarif = '1';
        this.devis_aj.typevente_pardefaut = this.modeTarif;
      } else {
        this.devis_aj.typevente_pardefaut = this.modeTarif;
      }
    })
  }

  getTypeVenteClient($c_cl) {
    this.devisApi.getTypeVenteCl($c_cl, this.serverURL).subscribe(res => {
      this.data = res;
      this.devis_aj.typevente_pardefaut = this.data.return[0].TYPECLIENT;
      if (this.devis_aj.typevente_pardefaut == null) {
        this.devis_aj.typevente_pardefaut = this.modeTarif;
      } else {
        this.devis_aj.typevente_pardefaut = this.data.return[0].TYPECLIENT;
      }
    });
  };

  async postDevis(devis$) {
    await this.devisApi.postDevis(devis$, this.serverURL)
      .subscribe(res => {
        let alert = this.alertCtrl.create({
          title: "Information",
          subTitle: res['msg'],
          buttons: ['OK']
        });
        alert.present();

        this.navCtrl.push(DevisAjoutProduitPage, devis$.NUMBON);
      }, (err) => {
        console.log(err);
      });

  }
  saveDevis(devis$) {
    if (devis$.CLIENT == null) {
      let alert = this.alertCtrl.create({
        title: "Information",
        subTitle: "Veuillez saisir tous les champs obligatoires !!!",
        buttons: ['OK']
      });
      alert.present();

    } else {
      let loading = this.loadingCtrl.create({
        content: 'Opération en cours ...'
      });
      loading.present();
      this.postDevis(devis$);
      loading.dismiss();

    }
  };



  search_php(event: {
    component: IonicSelectableComponent,
    text: string
  }) {

    let search = event.text.trim().toLowerCase();
    // event.component.startSearch();

    if (this.prodSubscription) {
      this.prodSubscription.unsubscribe();
    }

    // this.chargerDataApi(this.$skip, this.$size);

    if (search != "" && search != null) {
      this.skip_search = 0;

      this.clientsApi.GetFeedSearching1(search, this.skip_search, this.$size, this.serverURL).subscribe(
        res => {

          this.data = res;

          this.clients = this.data.return;
     
          event.component.items = this.clients

        });

    }

    if (!search) {
      // // Close any running subscription.
      if (this.prodSubscription) {
        this.prodSubscription.unsubscribe();

      }

      
        this.$skip = 0;
        this.clientsApi.getUsers(this.$skip, this.$size, this.serverURL)
          .subscribe(
            res => {
  
              this.data = res;
  
  
              this.clients = this.data.return;
  
  
              // this.produits = this.data.return;
              console.log('from search',   this.clients);
            });
    }


    event.component.enableInfiniteScroll();
  }


  onClose(event: { component: IonicSelectableComponent }) {
    this.$skip = 0;
    this.skip_search = 0;
 
    this.clientsApi.getAllclient1(this.devis_aj.CLIENT, this.serverURL).subscribe(
      res => {
        this.data = res;
  
    
        this.clients = this.data.return;
        this.devis_aj.CLIENT=this.data.return[0].C_CLIENT;
        console.log('from on close', this.clients);
      });



  }



  loadMore(event: {
    component: IonicSelectableComponent,
    text: string
  }) {

    let search = event.text.trim().toLowerCase();
    setTimeout(() => {
      event.component.scrollToBottom().then(() => {
        if (search != "") {

          this.skip_search = this.skip_search + this.$size;
          this.clientsApi.GetFeedSearching1(search, this.skip_search, this.$size, this.serverURL).subscribe(
            res => {

              this.data = res;

              for (let i = 0; i < this.data.return.length; i++) {
                this.clients.push(this.data.return[i]);
              }
              event.component.items = this.clients;

            });

          if (this.data.return.length < this.$size) {
            event.component.disableInfiniteScroll();
          }
          event.component.endInfiniteScroll();
        } else {

          this.$skip = this.$skip + this.$size;

          this.clientsApi.getUsers(this.$skip, this.$size, this.serverURL)
            .subscribe(
              res => {

                this.data = res;

                for (let i = 0; i < this.data.return.length; i++) {
                  this.clients.push(this.data.return[i]);
                }

              });

          event.component.endInfiniteScroll();

        }
      }).catch(() => { console.log('errr'); });
    }, 500);
  }
}
