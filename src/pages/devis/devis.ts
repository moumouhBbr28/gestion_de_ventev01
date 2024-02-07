import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController, App } from 'ionic-angular';
import { DevisProvider } from "../../providers/devis/devis";
import { DevisAjoutPage } from "../devis-ajout/devis-ajout";
import { DevisDataPage } from "../devis-data/devis-data";
import { ReglementsPage } from "../reglements/reglements";
import { ConversionProvider } from "../../providers/conversion/conversion";
import { FactvDataPage } from "../factv-data/factv-data";
import { BonLivrDataPage } from "../bon-livr-data/bon-livr-data";
import { CommandesDataPage } from "../commandes-data/commandes-data";
import { Storage } from '@ionic/storage';

import { BonLivraisonProvider } from '../../providers/bon-livraison/bon-livraison';

import { File, IWriteOptions } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import jsPDF from 'jspdf';

import autoTable from 'jspdf-autotable';

import domtoimage from 'dom-to-image';
import * as writtenNumber from 'written-number';

@Component({
  selector: 'page-devis',
  templateUrl: 'devis.html',
})

export class DevisPage {
  data: any;
  users = [];
  $size = 30;
  $skip = 0;
  hasData = 1; //Pour verifier le chargmnt de données
  searchMode = false; //Pour la recherche
  searchString = ""; //La chaine a chercher
  pageCount; suc; msg_prod; query: string = "";
  skip_search = 0;
  serverURL;

  //INFORMATIONS A ECRIRE DANS LE PDF
  entete: any;
  ExerciceEnCours: string;
  dateBonItemDay: string;
  dateBonItemMonth: string;
  LignesDeEntete: string[] = [];
  LignesDeBasPage: string[] = [];
  signature: string;
  logo: any;
  PrecederLaDatePar: string;
  numBon: any;
  DetailBon: any
  NetHT: any
  dateBonItemYear: number;
  $numbon_cnvrt;
  $c_client_cnvert;
  
  constructor(public navCtrl: NavController, public restApi: DevisProvider,
    private restApiGetEntete: BonLivraisonProvider,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public conversionApi: ConversionProvider,
    public app: App, public storage: Storage,
    private file: File, private fileOpener: FileOpener,
  ) {

    this.storage.get('ip_adr').then((val) => {
      this.serverURL = val;
     
      let loading = this.loadingCtrl.create({
        content: 'Chargement en cours ...'
      });
      loading.present();
      if (this.searchMode == false) {
        this.chargerDataApi(this.$skip, this.$size);
        this.getEntete();
      }
      loading.dismiss();
    });

  }

  ionViewWillEnter(){
    this.chargerDataApi(this.$skip, this.$size);
    this.getEntete();
  }
  getEntete() {
    this.restApiGetEntete.getEntete(this.serverURL)
      .subscribe(
        res => {
          this.entete = res;
          //Obtenir l'exercice en cours qui est un float et extraire la partie decimal 
          var ExerciceEnCoursFloatString = this.entete.return[0].EXERCICEENCOURS;
          ExerciceEnCoursFloatString = (ExerciceEnCoursFloatString + "").split(".");
          this.ExerciceEnCours = ExerciceEnCoursFloatString[0];

          //Obtenir les 5 lignes de l'entete
          this.LignesDeEntete.push(this.entete.return[0].LIGNE1HAUT);
          this.LignesDeEntete.push(this.entete.return[0].LIGNE2HAUT);
          this.LignesDeEntete.push(this.entete.return[0].LIGNE3HAUT);
          this.LignesDeEntete.push(this.entete.return[0].LIGNE4HAUT);
          this.LignesDeEntete.push(this.entete.return[0].LIGNE5HAUT);

          //Extraire le logo de l'entreprise 
          this.logo = this.entete.return[0].IMAGELOGO;

          //Extraire la ligne qui precède la date 
          this.PrecederLaDatePar = this.entete.return[0].PRECEDERDATEPAR;

          //Extraire les lignes de bas de page
          this.LignesDeBasPage.push(this.entete.return[0].LIGNE1BAS);
          this.LignesDeBasPage.push(this.entete.return[0].LIGNE2BAS);
          this.LignesDeBasPage.push(this.entete.return[0].LIGNE3BAS);

          //Extraire la signature
          this.signature = this.entete.return[0].SIGNATURE;

        });
  }

  FormaterDonneesItem(itemFonction) {

    //Arrondir les floats à deux chiffre après la virgule
    itemFonction.TOTALHT = (Math.round(itemFonction.TOTALHT * 100) / 100).toFixed(2),
      itemFonction.TAUXREMISE = (Math.round(itemFonction.TAUXREMISE * 100) / 100).toFixed(2);
    itemFonction.MONTREMISE = (Math.round(itemFonction.MONTREMISE * 100) / 100).toFixed(2);
    itemFonction.TOTALTTC = (Math.round(itemFonction.TOTALTTC * 100) / 100).toFixed(2);
    itemFonction.TVA = (Math.round(itemFonction.TVA * 100) / 100).toFixed(2);

    //Calculer le Net H.T
    if (itemFonction.TOTALHT != null) this.NetHT = (itemFonction.TOTALHT - itemFonction.MONTREMISE)
    else this.NetHT = 0;
    this.NetHT = (Math.round(this.NetHT * 100) / 100).toFixed(2);

    //mettre un espace après chaque trois chiffres grace aux expressions régulière 
    this.NetHT = this.NetHT.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    itemFonction.TOTALHT = itemFonction.TOTALHT.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    itemFonction.MONTREMISE = itemFonction.MONTREMISE.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    itemFonction.TVA = itemFonction.TVA.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    itemFonction.TOTALTTC = itemFonction.TOTALTTC.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

    //Récuperer la date du bon et la diviser en jour/mois/annee
    var dateBonItem = new Date(itemFonction.DATE_BON);

    var dateBonItemDaySans0 = dateBonItem.getDate();
    /*Si le jours est inferieur à 10 on rajoute un 0 devant le nombre par exemple 9 deviens 09*/
    if (dateBonItemDaySans0 < 10) {
      this.dateBonItemDay = '0' + dateBonItemDaySans0;
    } else {
      this.dateBonItemDay = '' + dateBonItemDaySans0;
    }

    var dateBonItemMonthSans0 = dateBonItem.getMonth() + 1;
    /*Si le mois est inferieur à 10 on rajoute un 0 devant le nombre par exemple 3 deviens 03*/
    if (dateBonItemMonthSans0 < 10) {
      this.dateBonItemMonth = '0' + dateBonItemMonthSans0;
    } else {
      this.dateBonItemMonth = '' + dateBonItemMonthSans0;
    }
    this.dateBonItemYear = dateBonItem.getFullYear();

    return itemFonction;
  }

  FormaterDonnesDetailsBon(DetailBon) {
    //arrondir les valeurs qui ont une virgule, calculer le total 
    //Compteur de ligne
    var cmp = 1;
    this.DetailBon.return.forEach(x => {
      //Calculer le prix après la remise pour chaque produit
      var PrixDeLaRemise = x[4] * x[5] / 100;
      //Le nouveau prix unitaire
      var NouveauPrixUnitaire = x[4] - PrixDeLaRemise
      //Calculer le total de chaque ligne (prix unitaire * quantité)   
      x[7] = NouveauPrixUnitaire * x[3];
      //Le PUHT
      x[4] = (Math.round(x[4] * 100) / 100).toFixed(2);
      //mettre un espace après chaque trois chiffres grace aux expressions régulière  
      x[4] = x[4].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

      //La total
      x[7] = (Math.round(x[7] * 100) / 100).toFixed(2);
      x[7] = x[7].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

      //prendre la partie decimal de la QTE
      x[3] = (x[3] + "").split(".");
      x[3] = x[3][0];

      //Ajouter le symbole % à la Remise et à la TVA
      x[5] = x[5] + " %"
      x[6] = x[6] + " %"

      //Ajouter le numéro de la lignes à droite du tableau
      x[0] = cmp;
      cmp = cmp + 1;

    });
    return DetailBon
  }

  /*LA FONCTION genererPdf() PEUT PARAITRE LONGUE MAIS LA SUITE ET LOGIQUE ET IL N'Y A RIEN DE COMPLIQUE */
  /*1- RECUPERER LA LISTE DES PRODUITS DE LA PROFORMA
    2- RECUPERER LES INFORMATIONS QU'ON VA INSERER DANS LE HEADER ET LE FOOTER DU PDF 
    3- CREER LE TABLEAU PRINCIPAL ET INSERER LE HEADER ET LE FOOTER DU PDF
    4- AFFICHER LE NOMBRE DE PRODUITS
    5- AFFICHER LES TOTAUX ET LA REMISE
    6- CREER LE PDF POUR ANDROID*/

  generatePdf(item) {
   
    item = this.FormaterDonneesItem(item);

    //On commence par récuperer les details du Bon (la liste des produits acheté)
    //Si on récupère les données dans un autre fonction et qu'on l'execute au début de generatePdf()
    //Le pdf ne va pas etre généré la première fois à cause du subscribe c'est pour cela qu'on a récupéré ICI 
    this.restApi.get_d_proforma_ParNumBon(item.NUMBON, this.serverURL)
      .subscribe(
        res => {
          this.DetailBon = res;
          //Convertir l'array d'objet en array de array pour l'utiliser dans autotable

          this.DetailBon.return = this.DetailBon.return.map(({ vide, C_PRODUIT, LIGNE, QTE, PUHT, REMISE, TVA, TOTAL }) => [vide, C_PRODUIT, LIGNE, QTE, PUHT, REMISE, TVA, TOTAL]);

          this.DetailBon = this.FormaterDonnesDetailsBon(this.DetailBon);

          //On récupère le code html s'il y en a
          const pdfBlock = document.getElementById("print-wrapper");
          //On définit les options d'insertions du contenu html dans le pdf
          const options = {
            background: "white",
            height: pdfBlock.clientHeight,
            width: pdfBlock.clientWidth,
            pagesplit: true
          };

          var doc = new jsPDF("p", "mm", "a4");
          //doc.addFont('light', 'Arial', 'normal');
          //doc.setFont('Arial');

          //columns représente le header du tableau principal
          const columns = [['N°', 'code', 'Désignation', 'Qté', 'Prix Unitaire', 'Rem', 'TVA ', 'Total']];

          //Créer le tableau dans le PDF
          autoTable(doc, {

            //head représente la première ligne du tableau celle qui contient les noms des colonnes
            head: columns,

            //body représente toutes les autres lignes du tableau
            body: this.DetailBon.return,

            //Verticalement, la position ou va s'afficher le body
            startY: 90,

            margin: { top: 70, bottom: 40 },

            //halign représente l'alignement dans une cellule
            styles: { overflow: 'linebreak', halign: 'center', lineWidth: 0.01, lineColor: '#000000' /*'#D4D4D4'*/ },

            alternateRowStyles: {
              fillColor: "#FFFFFF"
            },
            columnStyles: {
              //Définir la taille des cellules selon la colonne
              0: { cellWidth: 10 },
              1: { cellWidth: 20 },
              2: { cellWidth: 40 },
              3: { cellWidth: 20 },
              4: { cellWidth: 30 },
              5: { cellWidth: 18 },
              6: { cellWidth: 17 },
              7: { cellWidth: 35 },
              // etc
            },
            //La couleur de la première ligne du tableau 'le head'
            headStyles: {
              // fillColor: '#248B8B'

            },

          });

          //Tableau dans lequel va s'afficher le nomre d'article
          autoTable(doc, {
            head: [],
            body: [["Nombre d'articles : " + this.DetailBon.return.length]],
            margin: { left: 15 },
            styles: { overflow: 'linebreak', halign: 'left' },
            columnStyles: {

              0: { fillColor: '#FFFFFF' },

            },

          },
          );
          //Le petit tableau à droite à la fin du tableau principal 
          //Il contient le Total HT Total TTC et la remise

          autoTable(doc, {
            head: [],
            //On utilise math.round pour avoir une précision de deux chiffres après la virgule
            body: [[['Total H.T : '], [item.TOTALHT]],
            [['Remise : '], [item.TAUXREMISE + ' %  |  ' + item.MONTREMISE]],
            [['Net HT : '], this.NetHT],
            [['Total T.V.A : '], item.TVA],
            [['Total T.T.C : '], item.TOTALTTC],],
            margin: { left: 100, top: 70, bottom: 50 },
            styles: { overflow: 'linebreak', halign: 'center' },
            alternateRowStyles: {

            },
            columnStyles: {
              0: { cellWidth: 40, fillColor: '#FFFFFF', halign: 'right' },
              1: { cellWidth: 60, fillColor: '#FFFFFF', lineWidth: 0.01, lineColor: '#000000'/*'#D4D4D4'*/ },

            },

          },
          );

          //Ajouter le contenu html dans le pdf (s'il y en a)
          doc.html(pdfBlock, {
            callback: (doc) => {
              //le nombre total de pages générées
              var totalPages = doc.internal.pages.length - 1;

              //Inserer Le numéro de la page au pied de page 
              for (var i = 1; i <= totalPages; i++) {
                doc.setPage(i);
                doc.setFontSize(10);
                doc.setTextColor(150);

                doc.text('Page ' + i + ' / ' + totalPages, doc.internal.pageSize.getWidth() - 30, doc.internal.pageSize.getHeight() - 8);
              }
              //Ajouter La date et le numéro de la proforma
              for (var i = 1; i <= totalPages; i++) {
                doc.setPage(i);
                doc.setFontSize(15);
                doc.setTextColor(10);
                doc.text(this.PrecederLaDatePar + ' ' + this.dateBonItemDay + ' / ' + this.dateBonItemMonth + ' / ' + this.dateBonItemYear, 140, 37);
                doc.text('Proforma N° : ', 20, 37);
                doc.text(item.NUMBON + '   /   ' + this.ExerciceEnCours, 70, 37);
              }
              //Ajouter l'entete de la page
              //1- le logo et les traits
              for (var i = 1; i <= totalPages; i++) {
                doc.setPage(i);
                doc.setFontSize(13);
                doc.setTextColor(10);
                //Inserer deux lignes epaisses qui sépare l'entete et le bas de page du body (le tableau)
                doc.text('__________________________________________________________________________', 10, 27);
                doc.text('__________________________________________________________________________', 10, doc.internal.pageSize.getHeight() - 18);

                //Ajouter le logo
                //doc.addImage(this.logo, 'JPEG', doc.internal.pageSize.getWidth() - 40, 8, 0, 0);
                doc.addImage(this.logo, 'JPEG', 160, 4, 0, 0);
                //Ajouter la ligne signature
                doc.setPage(totalPages);
                doc.text(this.signature, doc.internal.pageSize.getWidth() - 40, doc.internal.pageSize.getHeight() - 40)

              }
              //les lignes de l'entete
              for (var i = 1; i <= totalPages; i++) {
                doc.setPage(i);
                doc.setFontSize(10);
                doc.setTextColor(96, 96, 96);
                doc.text(this.LignesDeEntete[0], 10, 5);
                doc.text(this.LignesDeEntete[1], 10, 10);
                doc.text(this.LignesDeEntete[2], 10, 15);
                doc.text(this.LignesDeEntete[3], 10, 20);
                doc.text(this.LignesDeEntete[4], 10, 25);
              }

              //les lignes du bas de page
              for (var i = 1; i <= totalPages; i++) {
                doc.setPage(i);
                doc.setFontSize(7);
                doc.setTextColor(10);
                doc.text(this.LignesDeBasPage[0], 10, doc.internal.pageSize.getHeight() - 12);
                doc.text(this.LignesDeBasPage[1], 10, doc.internal.pageSize.getHeight() - 3);
                doc.text(this.LignesDeBasPage[2], 10, doc.internal.pageSize.getHeight() - 7.5);

              }

              //Ajouter les informations du client dans la première page du document
              doc.setPage(1);
              doc.setFontSize(14);
              doc.setTextColor(10);
              doc.text('Informations Client', 20, 45);
              doc.setFontSize(11);
              doc.setTextColor(96, 96, 96);
              doc.text('Code Client :', 30, 53);
              doc.text(item.C_CLIENT, 100, 53);
              doc.text('Nom :', 30, 57);
              doc.text(item.D_CLIENT, 100, 57);
              doc.text('Adresse :', 30, 61);
              if (item.ADRESSE != null) {
                if (item.ADRESSE2 != null) {
                  doc.text(item.ADRESSE + ' - ' + item.ADRESSE2, 100, 61);
                } else {
                  doc.text(item.ADRESSE, 100, 61);
                }
              } else {
                if (item.ADRESSE2 != null) doc.text(item.ADRESSE2, 100, 61);
              }

              doc.text('Numéro de Téléphone :', 30, 65);
              if (item.TEL1 != null) doc.text(item.TEL1, 100, 65);
              doc.text('Matricule Fiscal :', 30, 71);
              if (item.IMMATFISC != null) doc.text(item.IMMATFISC, 100, 71);
              doc.text('N° Article:', 30, 75);
              if (item.ARTICLIMPO != null) doc.text(item.ARTICLIMPO, 100, 75);
              doc.text('Registre de Commerce:', 30, 79);
              if (item.REGISTRE != null) doc.text(item.REGISTRE, 100, 79);
              //Ouvrir le document dans le navigateur
              // doc.output("dataurlnewwindow");
              window.open(doc.output('bloburl').toString());
              //doc.save('Proforma_'+item.NUMBON);
            }
          });
          if (window.hasOwnProperty('cordova')) {
            //Partie android
            domtoimage.toPng(pdfBlock, options).then((fileUrl) => {

              let docRes = doc.output();
              let buffer = new ArrayBuffer(docRes.length);
              let array = new Uint8Array(buffer);
              for (var i = 0; i < docRes.length; i++) {
                array[i] = docRes.charCodeAt(i);
              }

              const directory = this.file.dataDirectory;
              const fileName = "Proforma" + item.NUMBON + ".pdf";

              let options: IWriteOptions = {
                replace: true
              };

              this.file.checkFile(directory, fileName).then((res) => {
                this.file.writeFile(directory, fileName, buffer, options)
                  .then((res) => {

                    this.fileOpener.open(this.file.dataDirectory + fileName, 'application/pdf')
                      .then(() => console.log('File is exported'))
                      .catch(e => console.log(e));
                  }).catch((error) => {
                    console.log(JSON.stringify(error));
                  });
              }).catch((error) => {
                this.file.writeFile(directory, fileName, buffer, options).then((res) => {

                  this.fileOpener.open(this.file.dataDirectory + fileName, 'application/pdf')
                    .then(() => console.log('File exported'))
                    .catch(e => console.log(e));
                })
                  .catch((error) => {

                  });
              });
            }).catch(function (error) {

            });
          }

        });
  }

  chargerDataApi($skip, $size) {
    
    this.restApi.getDevis($skip, $size, this.serverURL)
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
              // for (let i = 0; i < this.data.return.length; i++) {
              //   this.users.push(this.data.return[i]);
              // }
              this.users = this.data.return;
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

        /*
        for(let i=0; i<this.data.return.length; i++) {
          this.users.push(this.data.return[i]);
        }*/
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
          // for (let i = 0; i < this.data.return.length; i++) {
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

  goToAjoutDevis() {
    //this.navCtrl.push(DevisAjoutPage);
    this.app.getRootNav().setRoot(DevisAjoutPage);

  }

  goToDevisData($numbon,$c_client) {
    this.navCtrl.push(DevisDataPage, {$numbon:$numbon,$c_client:$c_client});
    //  this.app.getRootNav().setRoot(DevisDataPage,$numbon);

  }
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

  $nb_from;
  $table_from; $table_detail_from;
  $table_to; $table_detail_to;
  
  convert_list($numbon,$c_client) {
    this.$c_client_cnvert=$c_client;
    let alert = this.alertCtrl.create();
    alert.setTitle('Convertir la proforma n°' + $numbon + ' en ?');

    alert.addInput({
      type: 'radio',
      label: 'Commande',
      value: 'COMMANDC',
      checked: true
    });

    alert.addInput({
      type: 'radio',
      label: 'Facture',
      value: 'FACTURE',
      checked: false
    });

    alert.addInput({
      type: 'radio',
      label: 'Bon de livraison',
      value: 'BON_LIVR',
      checked: false
    });
    alert.addButton('Annuler');
    alert.addButton({
      text: 'OK',
      handler: data => {
        //var
        this.$nb_from = $numbon;
        this.$table_from = "PROFORMA";
        this.$table_detail_from = "D_PRO";

        this.$table_to = data + "";
        if (data == 'COMMANDC') {
          this.$table_detail_to = "D_COMC";
        }
        if (data == 'FACTURE') {
          this.$table_detail_to = "D_FACT";
        }
        if (data == 'BON_LIVR') {
          this.$table_detail_to = "D_LIVR";
        }

        //traitement
        this.convertPost(this.$nb_from, this.$table_from, this.$table_detail_from,
          this.$table_to, this.$table_detail_to);

      }
    });
    alert.present();
  }
  $data_conv; page_typ;
  async convertPost($$nb_from, $$table_from, $$table_detail_from, $$table_to, $$table_detail_to) {
    this.$data_conv = {
      'nb_from': $$nb_from,
      'table_from': $$table_from,
      'table_to': $$table_to,
      'table_detail_from': $$table_detail_from,
      'table_detail_to': $$table_detail_to
    };
    console.log('data', this.$data_conv);

    await this.conversionApi.appliquer(this.$data_conv, this.serverURL).subscribe(
      res => {
        this.data = res;
        console.log(res);
        let alert = this.alertCtrl.create({
          title: "Information",
          subTitle: this.data['msg'],
          buttons: [
            {
              text: 'OK',
              handler: () => {
                //redirection vers le nouveau
                if (this.data['page_to'] == 'DevisDataPage') {
                  this.page_typ = DevisDataPage;
                }
                if (this.data['page_to'] == 'CommandesDataPage') {
                  this.page_typ = CommandesDataPage;
                }
                if (this.data['page_to'] == 'BonLivrDataPage') {
                  this.page_typ = BonLivrDataPage;
                }
                if (this.data['page_to'] == 'FactvDataPage') {
                  this.page_typ = FactvDataPage;
                }

                this.$numbon_cnvrt=this.data['nb_to']
                this.navCtrl.push(this.page_typ, {$numbon:this.$numbon_cnvrt,$c_client:this.$c_client_cnvert});
              }
            },
          ]
        });
        alert.present();

      });
  }

}
