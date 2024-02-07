import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController } from 'ionic-angular';
import { StockProvider } from "../../providers/stock/stock";
import { Storage } from "@ionic/storage";

@IonicPage()
@Component({
  selector: 'page-stock',
  templateUrl: 'stock.html',
})
export class StockPage {
  data: any;
  users = [];
  $size = 30;
  $skip = 0;
  hasData = 1;
  searchMode = false;
  searchString = "";
  pageCount;
  suc;
  msg_prod;
  query: string = "";
  skip_search = 0;
  serverURL;

  constructor(public navCtrl: NavController, public restApi: StockProvider,
    public loadingCtrl: LoadingController, public storage: Storage) {

    this.storage.get('ip_adr').then((val) => {
      this.serverURL = val;

      if (this.searchMode == false) {
        let loading = this.loadingCtrl.create({

          content: 'Chargement en cours ...'
        });
    
        loading.present();
        this.restApi.getUsers(this.$skip, this.$size, this.serverURL)
          .subscribe(

            res => {

              this.data = res;
              for (let i = 0; i < this.data.return.length; i++) {
                this.users.push(this.data.return[i]);
              }

              setTimeout(() => {
                loading.dismiss();
              }, 2000);
            })
      }


    });

  }

  ionViewWillEnter() {

    this.chargerDataApi(this.$skip, this.$size);

  }


  chargerDataApi($skip, $size) {

 
    this.restApi.getUsers($skip, $size, this.serverURL)
      .subscribe(

        res => {

          this.data = res;
          this.pageCount = this.data.count;

          this.suc = this.data.success;
          if (this.suc == false) {
            this.msg_prod = this.data.msg;
            this.hasData = 0;
          } else {
            if (this.data.return.length == 0) {
              this.hasData = 0;
            } else {
              this.hasData = 1;

              // this.users = this.data.return;
              for (let i = 0; i < this.data.return.length; i++) {
                this.users.push(this.data.return[i]);
              }

            }


          }
        
        });

  };
  async GetFeedSearchingLocal($search, $skip_search) {
    await this.restApi.GetFeedSearching($search, $skip_search, this.serverURL).subscribe(
      res => {
        this.data = res;

        if (this.data.return.length == 0) {
          this.hasData = 0;
          this.skip_search = 0;
        } else {
          this.hasData = 1;
          this.users = this.data.return;
        }
      })
  }
  search_php(search) {
    this.searchString = search;
    if (this.searchString == null || this.searchString == "") {
      this.searchMode = false;
      this.users = [];
      this.$skip = 0;
      this.chargerDataApi(this.$skip, this.$size);

    } else {
      this.searchMode = true;
      this.users = [];
      this.GetFeedSearchingLocal(search, this.skip_search);
    }
  };

  async getNewElements($search, $skip_search) {
    await this.restApi.GetFeedSearching($search, $skip_search, this.serverURL).subscribe(
      res => {
        this.data = res;
        if (this.data.return.length == 0) {
          this.hasData = 0;
          this.skip_search = 0;
        } else {
          this.hasData = 1;
          // for(let i=0; i<this.data.return.length; i++) {
          //   this.users.push(this.data.return[i]);
          // }
          this.users = this.data.return;
        }
      });
  };

  loadMore(infiniteScroll$) {
    if (this.searchMode) {

      if (this.hasData) {
        this.skip_search = this.skip_search + this.$size;
        this.getNewElements(this.searchString, this.skip_search);
        infiniteScroll$.complete();
      } else {
        this.skip_search = 0;
      }
    } else {
      this.$skip = this.$skip + this.$size;
      this.chargerDataApi(this.$skip, this.$size);
      infiniteScroll$.complete();
    }

  };



  getImageUrl($blob) {
    var urlImg = $blob.toString();
    var url_dy = window.btoa(urlImg);
    return url_dy;
  };

}
