import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AlertController } from 'ionic-angular';


const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable()
export class ClientsProvider {

  constructor(public http: HttpClient  , public alertCtrl: AlertController){}

  getUsers(skip,size,$apiUrl){
    return this.http.get($apiUrl+"clients/liste_clients.php?skip="+skip+"&size="+size)
  }

  getClient($code,$apiUrl){
    console.log('code ts',$code)
    return this.http.get($apiUrl+"clients/fiche_client_id.php?code="+$code)
  }
  
  getAllclient1($client,$apiUrl){
    console.log('code client ts',$client)
    return this.http.get($apiUrl+"clients/clientApartir.php?client="+$client)
  }

  getEntete($apiUrl){
    return this.http.get($apiUrl+"clients/entete.php");
  }
  getMaxClient($apiUrl){
    return this.http.get($apiUrl+"clients/maxclient.php");
  }
    ifExistsClient($code,$apiUrl){
    return  this.http.get($apiUrl+"clients/exist_id.php?id="+$code);
  }

  postClient(data,$apiUrl): Observable<any> {
    const url = $apiUrl+`clients/ajout_clients.php`;
    return this.http.post(url, data, httpOptions).pipe();
  }

  updateClient(data,$apiUrl): Observable<any> {
    const url = $apiUrl+`clients/modif_client.php`;
    return this.http.post(url, data, httpOptions).pipe();
  }

  deleteCl(id: string , $apiUrl): Observable<{}> {
    const url = $apiUrl+`clients/supprimerClient.php?id=`+id;
    return this.http.post(url, httpOptions).pipe();
  }


  getAllClients( $apiUrl){
    return this.http.get($apiUrl+"clients/tous_clients.php");
  }

  GetFeedSearching ($search,$skip , $apiUrl) {
    const url = $apiUrl + "clients/recherche.php?skip=" + $skip + "&size=" + 20;
    return this.http.post(url, {'search': $search}, httpOptions).pipe();
  }

  GetFeedSearching1 ($search,skip,size,$apiUrl) {
    const url = $apiUrl + "clients/recherche.php?skip="+skip+"&size="+size;
    return this.http.post(url, {'search': $search}, httpOptions).pipe();
  }

}
