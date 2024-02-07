import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { diversProvider } from "../../providers/divers/divers";
import { DevisProvider } from "../../providers/devis/devis";
import { ClientsProvider } from "../../providers/clients/clients";
import { Commande } from "../../models/Commande";
import { CommandesAjoutProduitPage } from "../commandes-ajout-produit/commandes-ajout-produit";
import moment from 'moment';
import { CommandesRemisePage } from "../commandes-remise/commandes-remise";
import { CommandesProvider } from "../../providers/commandes/commandes";
import { CommandesEditProduitPage } from "../../pages/commandes-edit-produit/commandes-edit-produit";
import { ReglementsPage } from "../reglements/reglements";
import { Storage } from '@ionic/storage';
import { IonicSelectableComponent } from 'ionic-selectable';
import { Subscription } from 'rxjs';



@IonicPage()
@Component({
  selector: 'page-commandes-data',
  templateUrl: 'commandes-data.html',
})
export class CommandesDataPage {
  $size = 15;
  $skip = 0;
  mod_dev: Commande;
  data: any;
  numBon: Object;
  clients: any;
  typevente: any;
  modePayement: any;
  REPRES: any;

  totaux_bht = 0;
  taux_tva_g = 0;
  taux_tva_g_r = 0;
  remise = {
    pourcetage: 0,
    taux: 0
  };
  proforma_data: any;
  valide_bdd: any;
  data_DPRO;
  valide_bdd_r: any;
  totalHt_d = 0;
  tauxRemise_d = 0;
  montTotaHt_remis = 0;
  TauxTvaProd = 0;
  totalHt = 0;
  totalNetHt = 0;
  tauxRemise = 0;
  taux_tva = 0;
  totalTTC = 0;
  dprod;
  TotalNetHt = 0;
  TotauxTTC = 0;
  totaux_netht = 0
  serverURL;

  prodSubscription: Subscription;
  searchString = "";
  skip_search = 0;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public diversApi: diversProvider,
    public devisApi: DevisProvider,
    public clientsApi: ClientsProvider,
    public cmdApi: CommandesProvider,
    public storage: Storage
  ) {

    this.numBon = this.navParams.data.$numbon;
    this.mod_dev = {
      "NUMBON": this.navParams.data.$numbon,
      "DATEBON": new Date().toISOString(),
      "CLIENT": null,
      "UTILISATEUR":null,
      "typevente_pardefaut": null,
      "PAIE": null,
      "REPRES": null,
      "VALIDE": null,
      "remisePrc": null,
      "remiseTaux": null,
      "DATE_BON_form": null,
      "refPiece": 0

    };

    this.storage.get('ip_adr').then((val) => {
      this.serverURL = val;

      let loading = this.loadingCtrl.create({
        content: 'Chargement en cours ...'
      }); loading.present();

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
        console.log('from navparams', this.navParams.data.$c_client);
        this.clientsApi.getAllclient1(this.navParams.data.$c_client, this.serverURL).subscribe(
          res => {
            this.data = res;
      
        
            this.clients = this.data.return;
    
            console.log('ccc', this.clients);
          });

      this.infoProformaGle();
      this.infoProduitOrdre();

      loading.dismiss();
    });

  }
  ionViewWillEnter() {

    this.refresh_list_DPRO();

    this.calcul_rem_details()
    this.infoProformaGle();

  }
  infoProformaGle() {

    //recupere Info client, ...
    this.cmdApi.getTypeVentSelCmd(this.numBon, this.serverURL).subscribe(
      res => {
        this.data = res;
        this.proforma_data = this.data.return[0];
        this.valide_bdd = this.proforma_data.VALIDE;

        if (this.valide_bdd == null) {
          this.mod_dev.VALIDE = false;
        } else {
          if (this.valide_bdd == "OUI") {
            this.mod_dev.VALIDE = true;
          } else {
            this.mod_dev.VALIDE = false;
          }
        }
        this.mod_dev.CLIENT = this.proforma_data.CLIENT;
        this.mod_dev.typevente_pardefaut = this.proforma_data.TYPEVENTE;
        this.mod_dev.DATEBON = new Date(this.proforma_data.DATE_BON).toISOString();
        this.mod_dev.PAIE = this.proforma_data.MODEPAIE;
        this.mod_dev.REPRES = this.proforma_data.COMMERCIAL;

        this.mod_dev.refPiece = this.proforma_data.REF_PIECE;

        this.mod_dev.remisePrc = this.proforma_data.TAUXREMISE;
        this.mod_dev.remiseTaux = this.proforma_data.MONTREMISE;
        if (this.mod_dev.remisePrc == null) {
          this.mod_dev.remisePrc = 0;
        }
        if (this.mod_dev.remiseTaux == null) {
          this.mod_dev.remiseTaux = 0;
        }

        this.remise = {
          pourcetage: this.mod_dev.remisePrc,
          taux: this.mod_dev.remiseTaux
        };
      });
  };


  getTypeVente($c_cl) {
    this.devisApi.getTypeVenteCl($c_cl, this.serverURL).subscribe(res => {
      this.data = res;
      if (this.data.return[0].TYPECLIENT != null) {
        this.mod_dev.typevente_pardefaut = this.data.return[0].TYPECLIENT;
      }
    });
  };



  calcul(data_DPRO$) {
    for (var i = 0; i < data_DPRO$.length; i++) {
      this.totalHt_d = parseInt(data_DPRO$[i].QTE) * data_DPRO$[i].PUHT;
      if (parseInt(data_DPRO$[i].REMISE) == 0 || parseInt(data_DPRO$[i].REMISE) == null) {
        this.tauxRemise_d = 0;
      } else {
        this.tauxRemise_d = (this.totalHt_d * data_DPRO$[i].REMISE) / 100;
      }
      this.montTotaHt_remis = (this.totalHt_d - this.tauxRemise_d);
      this.totaux_bht = this.totaux_bht + this.montTotaHt_remis;
      this.TauxTvaProd = (this.montTotaHt_remis * parseInt(data_DPRO$[i].TVA)) / 100;//notyet
      this.taux_tva_g = this.taux_tva_g + this.TauxTvaProd;////notyet
    }
  }

  infoProduitOrdre() {
    //recupere les info pour un devis donné  apartir de la table d_pro
    this.cmdApi.get_d_cmd_ParNumBon(this.numBon, this.serverURL).subscribe(
      res => {
        this.data = res;
        this.data_DPRO = this.data.return;
        this.calcul(this.data.return);
      });
  };



  confirm_valid() {
    let alert = this.alertCtrl.create({
      title: 'Confirmation',
      message: 'Etes vous sûr d\'appliquer ces changements ?',
      buttons: [
        {
          text: 'Annuler', role: 'cancel', handler: () => {
            this.infoProformaGle();
          }
        }, {
          text: 'Ok', handler: () => {
            this.cmdApi.getTypeVentSelCmd(this.numBon, this.serverURL).subscribe(
              res => {
                this.data = res;
                this.valide_bdd_r = this.data.return[0].VALIDE;
                if (this.valide_bdd_r == "OUI") {
                  this.cmdApi.devalider(this.numBon, this.serverURL).subscribe(
                    res => {
                      let alert = this.alertCtrl.create({
                        title: "Information",
                        subTitle: res['msg'],
                        buttons: ['OK']
                      });
                      alert.present();
                    });
                } else {
                  this.cmdApi.valider(this.numBon, this.serverURL).subscribe(
                    resp => {
                      let alert = this.alertCtrl.create({
                        title: "Information",
                        subTitle: resp['msg'],
                        buttons: ['OK']
                      });
                      alert.present();
                    });
                }
              });
          }
        }
      ]
    });
    alert.present();
  };


  details($NUMBON, $ORDRE, $c_prod, $qtes, $remise, $PUHT, $TVA) {
    this.totalHt = parseInt($qtes) * $PUHT;
    this.totalNetHt = this.totalHt;
    if ($remise == 0) {
      this.tauxRemise = 0;
    } else {
      this.tauxRemise = (this.totalHt * $remise) / 100;
      this.totalNetHt = this.totalHt - this.tauxRemise;
    }
    this.taux_tva = (this.totalNetHt * $TVA) / 100;
    this.totalTTC = this.totalNetHt + this.taux_tva;
    let alert = this.alertCtrl.create({
      title: 'Commande N°' + $NUMBON + "/" + $ORDRE,
      subTitle: '' +
        '<p><b>Code produit:</b> ' + $c_prod + '</p>' +
        '<p><b>PUHT:</b> ' + (Math.round($PUHT * 100) / 100) + '</p>' +
        '<p><b>Quantité:</b> ' + parseInt($qtes) + '</p>' +

        '<p><b>Total brut HT:</b> ' + this.totalHt + '</p>' +
        '<p><b>Taux de remise: </b> ' + this.tauxRemise + ' (' + parseInt($remise) + '%)</p>' +
        '<p><b>Total net HT:</b> ' + this.totalNetHt + '</p>' +
        '<p><b>TVA:</b> ' + parseInt($TVA) + '%</p>' +
        '<p><b>Total TTC:</b> ' + this.totalTTC + '</p>',
      buttons: ['OK']
    });
    alert.present();
  }


  editer($NUMBON,$LIGNE, $ORDRE, $VALIDE) {
    if ($VALIDE) {
      let alert = this.alertCtrl.create({
        title: "Information",
        subTitle: 'On ne peut pas editer ce produit parce que la commande est validée !',
        buttons: ['OK']
      });
      alert.present();

    } else {
      this.dprod = { $NUMBON: $NUMBON,$LIGNE, $ORDRE: $ORDRE };
      this.navCtrl.push(CommandesEditProduitPage, this.dprod);

    }
  };



  
  calcul_rem_details() {

    this.cmdApi.get_detail_totaux(this.numBon, this.serverURL).subscribe(
      res => {
        this.data = res;
        this.totaux_bht = this.data.return[0].TOTALHT;
        this.remise.taux = this.data.return[0].MONTREMISE;
        this.remise.pourcetage = this.data.return[0].TAUXREMISE;
        this.totaux_netht = this.data.return[0].TOTALNET;
        this.taux_tva_g_r = this.data.return[0].TVA;
        this.TotauxTTC = this.data.return[0].TOTALTTC;
        console.log('data', this.totaux_bht)
      });

  };


  ajouter_des_prod_d($NUMBON, $VALIDE) {
    if ($VALIDE) {
      let alert = this.alertCtrl.create({
        title: "Information",
        subTitle: 'On ne peut pas ajouter des produits parce que la commande est validée !',
        buttons: ['OK']
      });
      alert.present();
    } else {
      this.navCtrl.push(CommandesAjoutProduitPage, $NUMBON);
    }

  };

  data_remise = {
    totaux_bht: null,
    c_proforma: null
  };
  ajt_remise_globle($c_proforma, $totaux_bht, $valide) {
    if ($valide) {
      let alert = this.alertCtrl.create({
        title: "Information",
        subTitle: 'On ne peut pas appliquer une remise globale parce que la commande est validée !',
        buttons: ['OK']
      });
      alert.present();
    } else {
      this.data_remise = {
        totaux_bht: $totaux_bht,
        c_proforma: $c_proforma
      };
      this.navCtrl.push(CommandesRemisePage, this.data_remise);
    }


  };


 
  details_globale() {
    this.calcul_rem_details();
    let alert = this.alertCtrl.create({
      title: 'Détails bon N°' + this.numBon,
      subTitle: '' +
        '<p><b>Total brut HT:</b> ' + new Intl.NumberFormat().format(this.totaux_bht) + '</p>' +
        '<p><b>Taux de remise: </b> ' + new Intl.NumberFormat().format(this.remise.taux) + ' (' +
        this.remise.pourcetage + '%)</p>' +

        '<p><b>Total net HT: </b> ' + new Intl.NumberFormat().format(this.totaux_netht) + '</p>' +

        '<p><b>Taux TVA:</b> ' + new Intl.NumberFormat().format(this.taux_tva_g_r) + '</p>' +
        '<p><b>Total TTC:</b> ' + new Intl.NumberFormat().format(this.TotauxTTC) + '</p>',
      buttons: ['OK']
    });
    alert.present();
  };

  refresh_list_DPRO() {
    this.cmdApi.get_d_cmd_ParNumBon(this.numBon, this.serverURL).subscribe(
      res => {
        this.data = res;
        this.data_DPRO = this.data.return;
        this.taux_tva_g = 0;
        this.totaux_bht = 0;
        for (var i = 0; i < this.data_DPRO.length; i++) {

          this.totalHt_d = parseInt(this.data_DPRO[i].QTE) * this.data_DPRO[i].PUHT;
          if (parseInt(this.data_DPRO[i].REMISE) == 0 || parseInt(this.data_DPRO[i].REMISE) == null) {
            this.tauxRemise_d = 0;
          } else {
            this.tauxRemise_d = (this.totalHt_d * this.data_DPRO[i].REMISE) / 100;
          }
          this.montTotaHt_remis = (this.totalHt_d - this.tauxRemise_d);
          this.totaux_bht = this.totaux_bht + this.montTotaHt_remis;
          this.TauxTvaProd = (this.montTotaHt_remis * parseInt(this.data_DPRO[i].TVA)) / 100;//notyet
          this.taux_tva_g = this.taux_tva_g + this.TauxTvaProd;////notyet

        }
      });
  };

  supprimer($NUMBON, $ORDRE, $VALIDE) {
    if ($VALIDE) {
      let alert = this.alertCtrl.create({
        title: "Information",
        subTitle: "On ne peut pas supprimer ce produit parce que la commande est validée !",
        buttons: ['Annuler']
      });
      alert.present();

    } else {
      let alert = this.alertCtrl.create({
        title: 'Confirmation',
        message: 'Etes vous sûr de supprimer  ce produit',
        buttons: [
          {
            text: 'Annuler',
            role: 'cancel'
          },
          {
            text: 'Supprimer',
            handler: () => {
              this.cmdApi.delete_produit_commandes_clients($NUMBON, $ORDRE, this.serverURL).subscribe(
                res => {
                  this.data = res;
                  this.refresh_list_DPRO();
                  let alert = this.alertCtrl.create({
                    title: "Information",
                    subTitle: this.data['msg'],
                    buttons: ['OK']
                  });
                  alert.present();
                });
            }
          }
        ]
      });
      alert.present();

    }
  };

  modifier_devis($mod_dev) {
    console.log('mod_dev',$mod_dev)
    let loading = this.loadingCtrl.create({
      content: 'Opération en cours ...'
    });
    loading.present();

    if ($mod_dev.VALIDE) {
      loading.dismiss();
      let alert = this.alertCtrl.create({
        title: "Information",
        subTitle: "On ne peut pas modifier une commande validée !",
        buttons: ['OK']
      });
      alert.present();

    } else {
      loading.dismiss();
      $mod_dev.DATE_BON_form = (moment(new Date($mod_dev.DATEBON).toISOString()).format('YYYY-MM-DD hh:mm:ss'));

      this.cmdApi.update_info_commandes_clients($mod_dev, this.serverURL).subscribe(
        res => {
          this.data = res;
          let alert = this.alertCtrl.create({
            title: "Information",
            subTitle: this.data['msg'],
            buttons: ['OK']
          });
          alert.present();
        });
    }
  };

  $data = {
    $typ_reg: null,
    $piece_n: null,
    $client_c: null
  };

  regler($typ_reg, $piece_n, $client_c) {

    this.$data = {
      $typ_reg: $typ_reg,
      $piece_n: $piece_n,
      $client_c: $client_c
    };

    this.navCtrl.push(ReglementsPage, this.$data);

  }
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
 
    this.clientsApi.getAllclient1(this.mod_dev.CLIENT, this.serverURL).subscribe(
      res => {
        this.data = res;
  
    
        this.clients = this.data.return;
         //this.mod_dev.CLIENT=this.data.return[0].C_CLIENT;
        console.log('on close',this.mod_dev.CLIENT);
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
