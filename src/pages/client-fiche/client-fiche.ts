import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController , AlertController } from 'ionic-angular';
import {Client} from "../../models/Client";
import { ClientsProvider } from "../../providers/clients/clients";
import {diversProvider} from "../../providers/divers/divers";
import { Storage } from '@ionic/storage';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@IonicPage()
@Component({
  selector: 'page-client-fiche',
  templateUrl: 'client-fiche.html',
})

export class ClientFichePage {
  codeClient ;
  client : Client;
  pays_list : any;
  ville_list : any;
  formej_list : any;
  secteura_list : any;
  tarifs_list : any;
  res:any;
  data_divers:any;
  serverURL;

  constructor(public navCtrl: NavController,
              public navParams: NavParams, 
              public clientPr:ClientsProvider,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController ,
              public pay:diversProvider , 
              public storage: Storage
       ) {


    this.codeClient = this.navParams.data;
console.log(' as  a', this.codeClient);
   this.client={
        "C_CLIENT": null,
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
       this.pay.getPays( this.serverURL).subscribe(
        res => {
          this.data_divers = res;
          this.pays_list = this.data_divers.return;
        });
      this.pay.getVille( this.serverURL).subscribe(
        res => {
           this.data_divers = res;
          this.ville_list = this.data_divers.return;
        });
      this.pay.getFormeJuri( this.serverURL).subscribe(
        res => {
           this.data_divers = res;
          this.formej_list = this.data_divers.return;
        });
      this.pay.getSecteurA( this.serverURL).subscribe(
        res => {
           this.data_divers = res;
          this.secteura_list = this.data_divers.return;
        });
      this.pay.getTarifs( this.serverURL).subscribe(
        res => {
          this.data_divers = res;
          this.tarifs_list = this.data_divers.return;
        });
      
      
      this.getClientById(this.codeClient);
    });
     

  }

  getClientById($client){
    this.clientPr.getClient($client, this.serverURL).subscribe(
      resp => {
        this.res = resp;
        this.client={
          "C_CLIENT": this.res.return[0].C_CLIENT,
          "D_CLIENT": this.res.return[0].D_CLIENT,
          "REP_CLIENT": this.res.return[0].REP_CLIENT,
          "SECTEUR": this.res.return[0].SECTEUR,
          "ADRESSE": this.res.return[0].ADRESSE,
          "ADRESSE2": this.res.return[0].ADRESSE2,
          "TYPECLIENT": this.res.return[0].TYPECLIENT,
          "ADRESSEL1": this.res.return[0].ADRESSEL1,
          "ADRESSEL2": this.res.return[0].ADRESSEL2,
          "PAYS": this.res.return[0].PAYS,
          "VILLE": this.res.return[0].VILLE,
          "CODEPOSTAL": this.res.return[0].CODEPOSTAL,
          "TEL1": this.res.return[0].TEL1,
          "TEL2": this.res.return[0].TEL2,
          "TEL3": this.res.return[0].TEL3,
          "FAX": this.res.return[0].FAX,
          "EMAIL": this.res.return[0].EMAIL,
          "URL": this.res.return[0].URL,
          "REGISTRE": this.res.return[0].REGISTRE,
          "ARTICLIMPO": this.res.return[0].ARTICLIMPO,
          "IMMATFISC": this.res.return[0].IMMATFISC,
          "FORME": this.res.return[0].FORME,
        };
      });

  }


  async modifClient($client){
    await this.clientPr.updateClient($client, this.serverURL)
      .subscribe(res=>{
        let alert = this.alertCtrl.create({
          title: 'Information',
          subTitle: res['msg'],
          buttons: ['OK']
        });
        alert.present();
    
      }, (err) => {
        console.log(err);
      });
  }

  validerModif($client){
    const confirm = this.alertCtrl.create({
      title: 'Confirmer',
      message: 'Êtes-vous sûr de vouloir valider les modifications ?',
      buttons: [
        { text: 'Annuler'},
        { text: 'D\'accord',
          handler: () => {
            let loading = this.loadingCtrl.create({
              content: 'Modification en cours ...'
            });

            loading.present();

            if($client.D_CLIENT == null || $client.D_CLIENT == ""  ){
              loading.dismiss();
              let alert = this.alertCtrl.create({
                title: 'Attention',
                subTitle: 'Nom client est obligatoire ! Veuillez le saisir SVP !',
                buttons: ['OK']
              });
              alert.present();
            }else{
              this.modifClient($client);
              loading.dismiss();
             
      
            }
          }
        }
      ]
    });
    confirm.present();
   
  }
}
