import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Events, Platform, ToastController, Alert } from 'ionic-angular';
import { RegisterPage } from "../register/register";
import { LoginProvider } from "../../providers/login/login";
import { TabsPage } from "../tabs/tabs";
import { LgAccueilPage } from "../lg-accueil/lg-accueil";
import { Storage } from '@ionic/storage';
import { ServerConfigPage } from "../server-config/server-config";

import { DevisAjoutProduitPage } from "../devis-ajout-produit/devis-ajout-produit";
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { user } from '../../models/user';
import { Connection, Network } from '@ionic-native/network';
import { DevisPage } from '../devis/devis';

import { BehaviorSubject, Observable } from 'rxjs';
import { ContactPage } from '../contact/contact';
import { FactvPage } from '../factv/factv';
import { stringify } from 'querystring';

export enum ConnectionStatus {
  Online,
  Offline,
  cc
}
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  data; username; password; msgError; serverURL;

  DATA: any;
  disconnect = false;
  USER$: user;
  connect = false;
  results: any;

  status: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loginApi: LoginProvider,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public storage: Storage,
    public sqlite: SQLite,
    public network: Network,

    public events: Events,
    public platform: Platform,
    public toastCtrl: ToastController

  ) {

    // setTimeout(() => {
    //   this.initializeNetworkEvents();
    // }, 2000);

    // Observable.interval(2000).subscribe(() => {
    this.platform.ready().then(() => {

      //   this.network.onDisconnect().subscribe(() => {

      //         console.log('status',this.status)

      // })

      //   this.network.onConnect().subscribe(() => {
      //     Observable.interval(2000).subscribe(() => {

      //         this.status = 0
      //         console.log('status',this.status)

      //     let type=this.network.type
      // console.log('network',network.type)
      //     Observable.interval(2000).subscribe(() => {
      //       if( type == "none" || type == undefined ){

      //         this.status = 1
      //                      console.log('status',this.status)
      //                      console.log('network',type)
      //       } else{
      //         this.status = 0
      //                     console.log('status',this.status)
      //                     console.log('network',type)
      //       }
      //       });

    });

    this.createTableSQL();

    this.USER$ = {
      "username": null,
      "password": null,
    }

    this.storage.get('ip_adr').then((val) => {
      console.log("VAL", val);
      this.serverURL = val;

    });
  }

  checkConnection() {
    if (navigator.onLine) {
      console.log('Internet is connected');
    } else {
      console.log('No internet connection');
    }
  }

  ionViewWillEnter() {
    this.checkConnection();
    this.getLoginSql();

  }

  loginSrv($user, $pass) {
    this.storage.set('user', $user);
    this.CREATEUSER($user);
    if (navigator.onLine) {

      console.log('Internet is connected');
    } else {

      console.log('No internet connection');
    }

    if (navigator.onLine) {

      this.loginApi.login($user, $pass, this.serverURL).subscribe(

        res => {
          console.log(res);
          this.data = res;
          if (this.data['success']) {

            this.createTableSQL().then(res => {

              this.sqlite.create({

                name: 'USERDATADEVICE.db',

                location: 'default'

              })

                .then((db: SQLiteObject) => {

                  db.executeSql('INSERT  OR REPLACE INTO LOGIN (USER_NAME,PASSWORD) VALUES (?,?)', [$user, $pass])

                    .then(() => {

                      // alert('DATA INSERTED');

                      console.log('USER DATA ', $user, $pass);
                    })

                    .catch(e => {

                      // alert('DATA NOT INSERTED');

                    });

                })

                .catch(e => console.log(e));

            }, err => {

              console.log("FAIL");

            });
            this.navCtrl.setRoot(TabsPage);
          }
          else {
            let alert = this.alertCtrl.create({
              title: "Erreur",
              subTitle: this.data['msg'],
              buttons: [{
                text: 'OK',
                handler: () => { }
              }]
            });
            alert.present();
          }
        }, error => {

          this.msgError = console.log(error); error;
          let alert = this.alertCtrl.create({
            title: "Erreur",
            subTitle: "Vérifiez la configuration de votre serveur ",
            buttons: [{
              text: 'OK',
              handler: () => { }
            }]
          });
          alert.present();
        })

    }
    else {

      this.DATA = [];

      this.sqlite.create({

        name: 'USERDATADEVICE.db',

        location: 'default'

      })

        .then((db: SQLiteObject) => {

          db.executeSql('SELECT * FROM LOGIN WHERE USER_NAME=? AND PASSWORD=?', [$user, $pass])

            .then((res) => {

              console.log('select *from login', res);

              for (let z = 0; z < res.rows.length; z++) {

                this.DATA.push({

                  USERNAME: res.rows.item(z).USER_NAME,

                  PASSWORD: res.rows.item(z).PASSWORD,

                }
                )

              }
              console.log(' this.DATA', this.DATA);
              console.log('.USERNAME', this.DATA[0].USERNAME);
              console.log('PASSWORD', this.DATA[0].PASSWORD);

              if (this.DATA[0].USERNAME == $user && this.DATA[0].PASSWORD == $pass) {
                // alert('vous êtes en mode hors connexion!')
                this.navCtrl.setRoot(TabsPage);

              }
              else {
                let alert = this.alertCtrl.create({
                  title: "Erreur",
                  subTitle: 'Le nom d\'utilisateur et le mot de passe ne sont pas valides',
                  buttons: [{
                    text: 'OK',
                    handler: () => { }
                  }]
                });
                alert.present();
              }

            })

            .catch(error => {

              console.log(error);

              let alert = this.alertCtrl.create({
                title: "Erreur",
                subTitle: 'Le nom d\'utilisateur et le mot de passe ne sont pas valides',
                buttons: [{
                  text: 'OK',
                  handler: () => { }
                }]
              });
              alert.present();

            });

        })

        .catch(e => console.log(e));

    }

  }

  goToSeConnecter(USER$) {
    let loading = this.loadingCtrl.create({
      content: 'Opération en cours ...'
    });
    loading.present();

    if (USER$.username == null || USER$.password == null) {
      loading.dismiss();
      let alert = this.alertCtrl.create({
        title: "Erreur",
        subTitle: "Veuillez saisir les champs obligatoires SVP !",
        buttons: [{
          text: 'OK',
          handler: () => { }
        }]
      });
      alert.present();
      //  this.navCtrl.setRoot(TabsPage);
    } else {
      this.loginSrv(USER$.username, USER$.password);
      loading.dismiss();
    }
  }
  goToRegister() {
    this.navCtrl.push(RegisterPage);
  }
  public type = 'password';
  public showPass = false;
  showPassword() {
    this.showPass = !this.showPass;
    if (this.showPass) {
      this.type = 'text';
    } else {
      this.type = 'password';
    }
  }
  goToAccueilLogin() {
    this.navCtrl.setRoot(LgAccueilPage);
  }

  goToConfigServer() {
    this.navCtrl.push(ServerConfigPage);
  }

  createTableSQL() {

    return new Promise((resolve, reject) => {

      this.sqlite.create({

        name: 'USERDATADEVICE.db',

        location: 'default'

      })

        .then((db: SQLiteObject) => {

          db.executeSql('CREATE TABLE IF NOT EXISTS LOGIN (USER_NAME UNIQUE,PASSWORD)', [])

            .then((res) => {

              // alert('USERTABLE TABLE CREATED');

              resolve(res);

            })

            .catch(e => {

              // alert('USERTABLE TABLE NOT CREATED');

              reject(e)

            });

        })

        .catch(e => console.log(e));

    });

  }

  getLoginSql() {

    this.DATA = [];

    this.sqlite.create({

      name: 'USERDATADEVICE.db',

      location: 'default'

    })

      .then((db: SQLiteObject) => {

        db.executeSql("SELECT * FROM LOGIN", [])

          .then((res) => {

            console.log(res);

            for (let z = 0; z < res.rows.length; z++) {

              this.DATA.push({

                USERNAME: res.rows.item(z).USER_NAME,

                PASSWORD: res.rows.item(z).PASSWORD,

              })

            }

            // alert('DATA LOADED SUCCESSFULLY');
            console.log('DATAA', this.DATA);

          })

          .catch(error => {

            console.log(error);

            // console.log('DATA NOT LOADED');

          });

      })

      .catch(e => console.log(e));

  }

  userConnectedSQL() {

    return new Promise((resolve, reject) => {

      this.sqlite.create({

        name: 'USERDATADEVICE.db',

        location: 'default'

      })
        .then((db: SQLiteObject) => {

          db.executeSql('CREATE TABLE IF NOT EXISTS USER (ID UNIQUE ,UTILISATEUR)', [])
            .then((res) => {
            //  alert('user table created')
              resolve(res);
            })
            .catch(e => {
             // alert('user table noooot created')
              reject(e)
            });
        })
        .catch(e => console.log(e));

    });

  }

  CREATEUSER($u) {
    this.userConnectedSQL().then(res => {

      this.sqlite.create({

        name: 'USERDATADEVICE.db',

        location: 'default'

      })

        .then((db: SQLiteObject) => {

          db.executeSql('INSERT  OR REPLACE  INTO USER (ID,UTILISATEUR)  VALUES (?,?)', [1, $u])

            .then(() => {
             // alert(' user inserted')
            })

            .catch(e => {
            //  alert(' user not inserted')
            });
        })

        .catch(e => console.log(e));

    }, err => {

      console.log("FAIL");

    });
  }

}
