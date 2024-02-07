import { Component } from '@angular/core';
import { IonicPage,NavController , LoadingController, AlertController} from 'ionic-angular';
import { ClientsProvider } from "../../providers/clients/clients";
import { ClientFichePage } from "../client-fiche/client-fiche";
import { ClientAjoutPage } from "../client-ajout/client-ajout";
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-clients',
  templateUrl: 'clients.html',
})
export class ClientsPage {
  data: any;
  users=[];
  $size = 10;
  $skip = 0;
  hasData = 1; //Pour verifier le chargmnt de données
  searchMode = false; //Pour la recherche
  searchString = ""; //La chaine a chercher
  pageCount;suc;msg_prod;query:string="";
  skip_search = 0;
  serverURL;
  data_t;
  constructor(public navCtrl: NavController, public restApi: ClientsProvider,
              public loadingCtrl: LoadingController,
              public storage: Storage,
              public alertCtrl: AlertController) {
     this.storage.get('ip_adr').then((val) => {
      this.serverURL = val;

       let loading = this.loadingCtrl.create({
        content: 'Chargement en cours ...'
      });
      loading.present();
      if(this.searchMode == false){
        this.chargerDataApi(this.$skip,this.$size);
      }
      loading.dismiss();

    
    });

   
  }
  chargerDataApi($skip,$size) {
    this.restApi.getUsers($skip,$size,this.serverURL)
      .subscribe(
        res => {
          this.data = res;
          this.pageCount = this.data.count;

          this.suc = this.data.success;
          if(this.suc == false){
            this.msg_prod = this.data.msg;
            this.hasData = 0;
          }else{
            if(this.data.return.length == 0){
              this.hasData = 0;
            }

            for(let i=0; i<this.data.return.length; i++) {
              this.users.push(this.data.return[i]);
            }
          }
        });
  };
  async GetFeedSearchingLocal($search,$skip_search){
    await this.restApi.GetFeedSearching($search,$skip_search,this.serverURL).subscribe(
      res => {
        this.data = res;

        if(this.data.return.length == 0){
          this.hasData=0;
          this.skip_search = 0;
        }else{
          this.hasData=1;
          this.users =this.data.return;
        }

        /*
         for(let i=0; i<this.data.return.length; i++) {
         this.users.push(this.data.return[i]);
         }*/
      })
  }
  search_php(search){
    this.searchString = search;
    if(this.searchString == null || this.searchString == ""){
      this.searchMode = false;
      this.users = [];
      this.$skip=0;
      this.chargerDataApi(this.$skip,this.$size);

    }else {
      this.searchMode = true;
      this.users = [];
      this.GetFeedSearchingLocal(search,this.skip_search);
    }
  };

  async getNewElements ($search, $skip_search) {
    await this.restApi.GetFeedSearching($search,$skip_search,this.serverURL).subscribe(
      res => {
        this.data = res;
        console.log(this.data);
        if(this.data.return.length == 0){
          this.hasData=0;
          this.skip_search = 0;
        }else{
          this.hasData=1;
          for(let i=0; i<this.data.return.length; i++) {
            this.users.push(this.data.return[i]);
          }
        }
      });
  };

  loadMore(infiniteScroll$) {
    if(this.searchMode){

      if(this.hasData){
        this.skip_search = this.skip_search +this.$size;
        this.getNewElements(this.searchString,this.skip_search);
        infiniteScroll$.complete();
      }else{
        this.skip_search =0;
      }
    }else{
      this.$skip = this.$skip +this.$size;
      this.chargerDataApi(this.$skip,this.$size);
      infiniteScroll$.complete();
    }

  };
  getImageUrl ($blob){
    var  urlImg = $blob.toString();
    var url_dy = window.btoa(urlImg);
    return  url_dy;
  };

  goToFicheClient($code_client){
 
   this.navCtrl.push(ClientFichePage, $code_client);
  }


  beforeAjout() {
    this.restApi.getEntete(this.serverURL).subscribe(
      res => {
        this.data_t = res;

        if(this.data_t.length!=0){
          if (res[0].CLIAUTO == "OUI") {
            this.restApi.getMaxClient(this.serverURL).subscribe(
              resp => {
                if (!isNaN(resp[0].MAXCLIENT)) {
                  //Si le dernier code est numérique
                  var max1 = (resp[0].MAXCLIENT )*1 +1;
                  var cl =  this.mettreVarchar(max1+"",res[0].LNGCLI*1);
                  this.addClient(cl)

                }else{
                  this.addClient(null);
                }
              });
          } else { this.addClient(null); }

        }else{
          this.addClient(null);
        }
         });
  }

  mettreVarchar(max,LNGCLI){
    var maxres = max;
    if ((LNGCLI != 0) && (max.length < LNGCLI)) {
      for (var i=0;i<(LNGCLI-(max.length));i++){
        maxres = '0' + maxres;
      }
    }
    return maxres;
  }

  addClient($params){
    if($params){
      this.navCtrl.push(ClientAjoutPage,$params);
    }else{
      this.navCtrl.push(ClientAjoutPage,"");
    }
  } 

}


