import { Component } from '@angular/core';
import { NavController, NavParams , LoadingController , AlertController} from 'ionic-angular';
import { Client } from "../../models/Client";

import { diversProvider  } from '../../providers/divers/divers';
import { ClientsProvider } from "../../providers/clients/clients";

import { ClientsPage   } from "../clients/clients";
import { Storage } from '@ionic/storage';


@Component({
  selector: 'page-client-ajout',
  templateUrl: 'client-ajout.html',
})


export class ClientAjoutPage {
  client_aj : Client;
  pays_list : any;
  ville_list : any;
  formej_list : any;
  secteura_list : any;
  tarifs_list : any;
  data_divers:any;
  serverURL;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public pay:diversProvider,  
              public clientPr:ClientsProvider,
              public loadingCtrl: LoadingController, 
              public alertCtrl: AlertController,
              public storage: Storage
              ) {

 this.client_aj={
          "C_CLIENT": this.navParams.data,
          "D_CLIENT": null,
          "REP_CLIENT": null,
          "SECTEUR": null,
          "ADRESSE": null,
          "ADRESSE2": null,
          "TYPECLIENT": null,
          "ADRESSEL1": null,
          "ADRESSEL2": null,
          "PAYS": null,
          "VILLE": null,
          "CODEPOSTAL": null,
          "TEL1": null,
          "TEL2": null,
          "TEL3": null,
          "FAX": null,
          "EMAIL": null,
          "URL": null,
          "REGISTRE": null,
          "ARTICLIMPO": null,
          "IMMATFISC": null,
          "FORME": null
        };


      this.storage.get('ip_adr').then((val) => {
        this.serverURL = val;

        this.pay.getPays(this.serverURL).subscribe(
          res => {
            this.data_divers = res;
            this.pays_list = this.data_divers.return;
          });
        this.pay.getVille(this.serverURL).subscribe(
          res => {
            this.data_divers = res;
            this.ville_list = this.data_divers.return;
          });
        this.pay.getFormeJuri(this.serverURL).subscribe(
          res => {
            this.data_divers = res;
            this.formej_list = this.data_divers.return;
          });
        this.pay.getSecteurA(this.serverURL).subscribe(
          res => {
            this.data_divers = res;
            this.secteura_list = this.data_divers.return;
          });
        this.pay.getTarifs(this.serverURL).subscribe(
          res => {
            this.data_divers = res;
            this.tarifs_list = this.data_divers.return;
          });
      });
  }


  async saveClient($client){
    await this.clientPr.postClient($client,this.serverURL)
      .subscribe(res => {
        let alert = this.alertCtrl.create({
          title: "Information",
          subTitle: res['msg'],
          buttons: ['OK']
        });
        alert.present();
        this.navCtrl.push(ClientsPage);

      }, (err) => {
        console.log(err);
      });

  }



  validerAjout($client){
    let loading = this.loadingCtrl.create({
      content: 'Ajout en cours ...'
    });

    loading.present();

    if($client.C_CLIENT == null || $client.C_CLIENT == "" ){
      loading.dismiss();
      let alert = this.alertCtrl.create({
        title: 'Attention',
        subTitle: 'Code client est obligatoire ! Veuillez le saisir SVP !',
        buttons: ['OK']
      });
      alert.present();


    }else{
      if($client.D_CLIENT == null ){
        loading.dismiss();
        let alert = this.alertCtrl.create({
          title: 'Attention',
          subTitle: 'Nom client est obligatoire ! Veuillez le saisir SVP !',
          buttons: ['OK']
        });
        alert.present();
      }else{
        this.clientPr.ifExistsClient($client.C_CLIENT,this.serverURL)
          .subscribe(
            res => {
              this.data_divers = res;
               if(this.data_divers.exist){

                 let alert = this.alertCtrl.create({
                   title: 'Attention',
                   subTitle: 'Code client existe déja ! choisissez un autre SVP !',
                   buttons: ['OK']
                 });
                 alert.present();
                 loading.dismiss();
               }else{
                 this.saveClient($client);
                 loading.dismiss();
               }
          }, (err) => {
              console.log(err);
              loading.dismiss();
              this.navCtrl.pop();
            });
      }
    }
  }
}
