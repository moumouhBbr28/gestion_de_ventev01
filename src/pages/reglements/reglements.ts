import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , AlertController ,LoadingController } from 'ionic-angular';
import { ReglementsProvider } from "../../providers/reglements/reglements";
import { reglement } from "../../models/reglement";
import { ClientsProvider } from "../../providers/clients/clients";
import moment from 'moment';
import {diversProvider} from "../../providers/divers/divers";
import {DevisProvider} from "../../providers/devis/devis";
import {CommandesProvider} from "../../providers/commandes/commandes";
import {BonLivraisonProvider} from "../../providers/bon-livraison/bon-livraison";
import {FactureVenteProvider} from "../../providers/facture-vente/facture-vente";
import {DevisDataPage} from "../devis-data/devis-data";
import {CommandesDataPage} from "../commandes-data/commandes-data";
import {BonLivrDataPage} from "../bon-livr-data/bon-livr-data";
import {FactvDataPage} from "../factv-data/factv-data";
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-reglements',
  templateUrl: 'reglements.html',
})
export class ReglementsPage {
  data;
  reg: reglement;
  typePAIE_list;
  clients;
  modePayement;
  comptes_list;



  totalHt_d =0;
  tauxRemise_d=0;
  montTotaHt_remis =0;
  TauxTvaProd=0;
  data_DPRO;
  totaux_bht=0;
  taux_tva_g=0
  ;TotalNetHt=0;
  taux_tva_g_r=0;
  TotauxTTC=0;

  remise = {
    taux:0,
    pourcetage:0
  };
  remisePrc;
  remiseTaux;
serverURL;
  constructor(public navCtrl: NavController,
              public navParams: NavParams ,
              public reglementApi: ReglementsProvider,
              public clientsApi : ClientsProvider,
              public diversApi : diversProvider,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              public devisApi : DevisProvider,
              public cmdApi : CommandesProvider,
              public blApi : BonLivraisonProvider,
              public factvApi : FactureVenteProvider  ,
              public storage: Storage
              ){

             this.reg = {
                      type_reg: this.navParams.data.$typ_reg,
                      n_piece: this.navParams.data.$piece_n,
                      client_d: this.navParams.data.$client_c,
                      date_reg: new Date().toISOString(),
                      date_format: null,
                      mode_paie: "ESPEC",
                      compte_s: "CAISS",
                      montn_py: null,
                      chqu_acc: true,
                      chqu_mont: null,
                      chqu_num: null
                    };



               this.storage.get('ip_adr').then((val) => { 
                  this.serverURL = val;

                     let loading = this.loadingCtrl.create({
                      content: 'Chargement en cours ...'
                    }); loading.present();

                    this.reglementApi.getTypeRegment(this.serverURL).subscribe(
                      res => {
                        this.data = res;
                        this.typePAIE_list = this.data.return;
                      });
                    this.reglementApi.getComptesSociete(this.serverURL).subscribe(
                      res => {
                        this.data = res;
                        this.comptes_list = this.data.return;
                      });

                    this.clientsApi.getAllClients(this.serverURL).subscribe(
                      res => {
                        this.data = res;
                        this.clients = this.data.return;
                      });

                    this.diversApi.getModePaie(this.serverURL).subscribe(
                      res => {
                        this.data = res;
                        this.modePayement = this.data.return;
                      });

                  
                    this.reg.date_format = moment( new Date(this.reg.date_reg).toISOString()).format('DD/MM/YYYY');

                    if( this.reg.type_reg == 'CP'){
                      this.getReglmentProforma();
                      loading.dismiss();
                    }
                    if( this.reg.type_reg == 'CC'){
                      this.getReglmentCommande();
                      loading.dismiss();
                    }
                    if( this.reg.type_reg == 'CB'){
                      this.getReglmentBonLivr();
                      loading.dismiss();
                    }
                    if( this.reg.type_reg == 'CV'){
                      this.getReglmentFatureVente();
                      loading.dismiss();
                    }


                });
 

  }

  montRegleBDD = 0;
  getReglmentProforma() {
    this.devisApi.getTypeVentSelDevis(this.reg.n_piece,this.serverURL).subscribe(
      res => {
        this.data = res;
        this.data = this.data.return[0];

       this.remisePrc = this.data.TAUXREMISE;
        this.remiseTaux = this.data.MONTREMISE;
        if(this.remisePrc ==null){
          this.remisePrc = 0;
        }

        this.remise.taux = this.remiseTaux;
        this.remise.pourcetage = this.remisePrc;
        this.montRegleBDD=this.data.MONTANTREGLE;
        if(this.montRegleBDD==null  || this.montRegleBDD==0 ){
          this.montRegleBDD=0;
        }

         this.devisApi.get_d_proforma_ParNumBon(this.reg.n_piece , this.serverURL).subscribe(
         res => {
           this.data = res;
           this.data_DPRO =this.data.return;

           for (var i=0;i<this.data_DPRO.length;i++){
           this.totalHt_d    =  parseInt(this.data_DPRO[i].QTE) * this.data_DPRO[i].PUHT;
           if(parseInt(this.data_DPRO[i].REMISE) == 0 || parseInt(this.data_DPRO[i].REMISE) == null) {
           this.tauxRemise_d = 0;
           } else{
           this.tauxRemise_d =  (this.totalHt_d * this.data_DPRO[i].REMISE)/100;
           }
           this.montTotaHt_remis = (this.totalHt_d - this.tauxRemise_d);
           this.totaux_bht   = this.totaux_bht + this.montTotaHt_remis;
           this.TauxTvaProd = (this.montTotaHt_remis  * parseInt(this.data_DPRO[i].TVA))/100;
           this.taux_tva_g =  this.taux_tva_g  + this.TauxTvaProd;
           }
           //this.remise.taux = (this.totaux_bht *  this.remise.pourcetage) / 100;

           if( this.remisePrc ==  0 &&  this.remiseTaux > 0){
             //raf //taux c depuis la bdd et le pourcetage c 0
           }   else {
             this.remiseTaux = (this.totaux_bht *   this.remisePrc) / 100;
           }
           this.TotalNetHt = (this.totaux_bht  - this.remise.taux);
           if(this.totaux_bht != 0){
             this.taux_tva_g_r =  this.taux_tva_g - (this.taux_tva_g * this.remise.taux / this.totaux_bht);
           }else{
             this.taux_tva_g_r = 0;
           }
           this.taux_tva_g_r = Math.round(this.taux_tva_g_r*100)/100;
           this.TotauxTTC =  this.TotalNetHt + this.taux_tva_g_r;
           this.TotauxTTC = Math.round(this.TotauxTTC*100)/100;

           this.reg.montn_py = this.TotauxTTC - this.montRegleBDD;





         });
      });

  };

  getReglmentCommande() {
    this.cmdApi.getTypeVentSelCmd(this.reg.n_piece , this.serverURL).subscribe(
      res => {
        this.data = res;
        this.data = this.data.return[0];

        this.remisePrc = this.data.TAUXREMISE;
        this.remiseTaux = this.data.MONTREMISE;
        if(this.remisePrc ==null){
          this.remisePrc = 0;
        }

        this.montRegleBDD=this.data.MONTANTREGLE;
        if(this.montRegleBDD==null  || this.montRegleBDD==0 ){
          this.montRegleBDD=0;
        }

        this.remise.taux = this.remiseTaux;
        this.remise.pourcetage = this.remisePrc;

        this.cmdApi.get_d_cmd_ParNumBon(this.reg.n_piece , this.serverURL).subscribe(
          res => {
            this.data = res;
            this.data_DPRO =this.data.return;

            for (var i=0;i<this.data_DPRO.length;i++){
              this.totalHt_d    =  parseInt(this.data_DPRO[i].QTE) * this.data_DPRO[i].PUHT;
              if(parseInt(this.data_DPRO[i].REMISE) == 0 || parseInt(this.data_DPRO[i].REMISE) == null) {
                this.tauxRemise_d = 0;
              } else{
                this.tauxRemise_d =  (this.totalHt_d * this.data_DPRO[i].REMISE)/100;
              }
              this.montTotaHt_remis = (this.totalHt_d - this.tauxRemise_d);
              this.totaux_bht   = this.totaux_bht + this.montTotaHt_remis;
              this.TauxTvaProd = (this.montTotaHt_remis  * parseInt(this.data_DPRO[i].TVA))/100;
              this.taux_tva_g =  this.taux_tva_g  + this.TauxTvaProd;
            }
           // this.remise.taux = (this.totaux_bht *  this.remise.pourcetage) / 100;

            if( this.remisePrc ==  0 &&  this.remiseTaux > 0){
              //raf //taux c depuis la bdd et le pourcetage c 0
            }   else {
              this.remiseTaux = (this.totaux_bht *   this.remisePrc) / 100;
            }

            this.TotalNetHt = (this.totaux_bht  - this.remise.taux);
            if(this.totaux_bht != 0){
              this.taux_tva_g_r =  this.taux_tva_g - (this.taux_tva_g * this.remise.taux / this.totaux_bht);
            }else{
              this.taux_tva_g_r = 0;
            }
            this.taux_tva_g_r = Math.round(this.taux_tva_g_r*100)/100;
            this.TotauxTTC =  this.TotalNetHt + this.taux_tva_g_r;
            this.TotauxTTC = Math.round(this.TotauxTTC*100)/100;
            this.reg.montn_py = this.TotauxTTC - this.montRegleBDD;
          });
      });

  };

  getReglmentBonLivr() {
    this.blApi.getTypeVentSelCmd(this.reg.n_piece , this.serverURL).subscribe(
      res => {
        this.data = res;
        this.data = this.data.return[0];

        this.remisePrc = this.data.TAUXREMISE;
        this.remiseTaux = this.data.MONTREMISE;
        if(this.remisePrc ==null){
          this.remisePrc = 0;
        }
        this.montRegleBDD=this.data.MONTANTREGLE;
        if(this.montRegleBDD==null  || this.montRegleBDD==0 ){
          this.montRegleBDD=0;
        }

        this.remise.taux = this.remiseTaux;
        this.remise.pourcetage = this.remisePrc;

        this.blApi.get_d_cmd_ParNumBon(this.reg.n_piece , this.serverURL).subscribe(
          res => {
            this.data = res;
            this.data_DPRO =this.data.return;

            for (var i=0;i<this.data_DPRO.length;i++){
              this.totalHt_d    =  parseInt(this.data_DPRO[i].QTE) * this.data_DPRO[i].PUHT;
              if(parseInt(this.data_DPRO[i].REMISE) == 0 || parseInt(this.data_DPRO[i].REMISE) == null) {
                this.tauxRemise_d = 0;
              } else{
                this.tauxRemise_d =  (this.totalHt_d * this.data_DPRO[i].REMISE)/100;
              }
              this.montTotaHt_remis = (this.totalHt_d - this.tauxRemise_d);
              this.totaux_bht   = this.totaux_bht + this.montTotaHt_remis;
              this.TauxTvaProd = (this.montTotaHt_remis  * parseInt(this.data_DPRO[i].TVA))/100;
              this.taux_tva_g =  this.taux_tva_g  + this.TauxTvaProd;
            }


            //this.remiseTaux = (this.totaux_bht *  this.remisePrc) / 100;

            if( this.remisePrc ==  0 &&  this.remiseTaux > 0){
              //raf //taux c depuis la bdd et le pourcetage c 0
            }   else {
              this.remiseTaux = (this.totaux_bht *   this.remisePrc) / 100;
            }

            this.TotalNetHt = (this.totaux_bht  - this.remiseTaux);
            if(this.totaux_bht != 0){
              this.taux_tva_g_r =  this.taux_tva_g - (this.taux_tva_g * this.remiseTaux / this.totaux_bht);
            }else{
              this.taux_tva_g_r = 0;
            }
            this.taux_tva_g_r = Math.round(this.taux_tva_g_r*100)/100;
            this.TotauxTTC =  this.TotalNetHt + this.taux_tva_g_r;
            this.TotauxTTC = Math.round(this.TotauxTTC*100)/100;
            this.reg.montn_py = this.TotauxTTC - this.montRegleBDD;



          });
      });

  };
  avoir_factv;
  getReglmentFatureVente() {
    this.factvApi.getTypeVentSelCmd(this.reg.n_piece,this.serverURL).subscribe(
      res => {
        this.data = res;
        this.data = this.data.return[0];

        this.avoir_factv = this.data.AVOIR ;
        this.remisePrc = this.data.TAUXREMISE;
        this.remiseTaux = this.data.MONTREMISE;
        if(this.remisePrc ==null){
          this.remisePrc = 0;
        }
        this.montRegleBDD=this.data.MONTANTREGLE;
        if(this.montRegleBDD==null  || this.montRegleBDD==0 ){
          this.montRegleBDD=0;
        }

        this.remise.taux = this.remiseTaux;
        this.remise.pourcetage = this.remisePrc;

        this.factvApi.get_d_cmd_ParNumBon(this.reg.n_piece,this.serverURL).subscribe(
          res => {
            this.data = res;
            this.data_DPRO =this.data.return;

            for (var i=0;i<this.data_DPRO.length;i++){
              this.totalHt_d    =  parseInt(this.data_DPRO[i].QTE) * this.data_DPRO[i].PUHT;
              if(parseInt(this.data_DPRO[i].REMISE) == 0 || parseInt(this.data_DPRO[i].REMISE) == null) {
                this.tauxRemise_d = 0;
              } else{
                this.tauxRemise_d =  (this.totalHt_d * this.data_DPRO[i].REMISE)/100;
              }
              this.montTotaHt_remis = (this.totalHt_d - this.tauxRemise_d);
              this.totaux_bht   = this.totaux_bht + this.montTotaHt_remis;
              this.TauxTvaProd = (this.montTotaHt_remis  * parseInt(this.data_DPRO[i].TVA))/100;
              this.taux_tva_g =  this.taux_tva_g  + this.TauxTvaProd;
            }

            if( this.remisePrc ==  0 &&  this.remiseTaux > 0){ }else
            {
              this.remiseTaux = (this.totaux_bht *   this.remisePrc) / 100;
            }

            this.TotalNetHt = (this.totaux_bht  - this.remiseTaux);
            if(this.totaux_bht != 0){
              this.taux_tva_g_r =  this.taux_tva_g - (this.taux_tva_g * this.remiseTaux / this.totaux_bht);
            }else{
              this.taux_tva_g_r = 0;
            }
            this.taux_tva_g_r = Math.round(this.taux_tva_g_r*100)/100;
            this.TotauxTTC =  this.TotalNetHt + this.taux_tva_g_r;
            this.TotauxTTC = Math.round(this.TotauxTTC*100)/100;
            this.reg.montn_py = this.TotauxTTC - this.montRegleBDD;

            if(this.avoir_factv == 'OUI'){
              this.remiseTaux = this.remiseTaux * -1;
              this.totaux_bht = this.totaux_bht * -1;
              this.TotalNetHt = this.TotalNetHt * -1;
              this.taux_tva_g_r = this.taux_tva_g_r * -1;
              this.TotauxTTC = this.TotauxTTC * -1;
              this.reg.montn_py = this.TotauxTTC - this.montRegleBDD;

            }
          });
      });

  };

  page_typ;
  ouvrir_piece($nb_piece){
    if( this.reg.type_reg == 'CP'){
      this.page_typ = DevisDataPage;
    }
    if( this.reg.type_reg == 'CC'){
      this.page_typ = CommandesDataPage;
    }
    if( this.reg.type_reg == 'CB'){
      this.page_typ = BonLivrDataPage;
    }
    if( this.reg.type_reg == 'CV'){
      this.page_typ = FactvDataPage;
    }
    //this.navCtrl.push(this.page_typ, $nb_piece);
  }

  details_globale(){ //pour tout le modules
    let alert = this.alertCtrl.create({
      title: 'Détails piéce n°'+this.reg.n_piece,
      subTitle: '' +
      '<p><b>Total brut HT:</b> '+new Intl.NumberFormat().format(this.totaux_bht)+'</p>' +
      '<p><b>Taux de remise: </b> '+   new Intl.NumberFormat().format(this.remise.taux)+ ' ('+
      this.remise.pourcetage+'%)</p>'+
      '<p><b>Total net HT:</b> '+ new Intl.NumberFormat().format(this.TotalNetHt)+'</p>' +
      '<p><b>Taux TVA:</b> '+ new Intl.NumberFormat().format(this.taux_tva_g_r) +'</p>'  +
      '<p><b>Total TTC:</b> '+ new Intl.NumberFormat().format(this.TotauxTTC)+'</p>',
      buttons: ['OK']
    });
    alert.present();
  }
  async post_regmntdaya($reg){
    await this.reglementApi.appliquer_reglement($reg,this.serverURL).subscribe(
      res => {
         this.data = res;
        let alert = this.alertCtrl.create({
          title: "Information",
          subTitle: this.data['msg'],
          buttons: ['OK']
        });
        alert.present();
        this.ouvrir_piece(this.reg.n_piece);
      });
  }

  appliquer_reg($reg){
    $reg.date_format = (moment( new Date($reg.date_reg).toISOString()).format('YYYY.MM.DD'));
    if(this.reg.montn_py <= 0 ){
      let alert = this.alertCtrl.create({
        title:   'Confirmation',
        message: 'Pièce entierement réglée , Voulez-vous continuer ?',
        buttons: [
          {
            text: 'Non', role: 'cancel', handler: ()=> { }
          }, {
            text: 'Oui', handler: () => {
              this.post_regmntdaya($reg);
            }
          }
        ]
      });
      alert.present();
    }else{
      this.post_regmntdaya($reg);
    }
 }
}
