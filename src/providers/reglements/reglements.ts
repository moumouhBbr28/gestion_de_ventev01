import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; 

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable()
export class ReglementsProvider { 
  constructor(public http: HttpClient){ }

  getTypeRegment($apiUrl){
    return this.http.get($apiUrl+"typepaie/index.php");
  }
  getComptesSociete($apiUrl){
    return this.http.get($apiUrl+"reglement/liste_compte_reg.php");
  }
  appliquer_reglement($data , $apiUrl){
    const url = $apiUrl+`reglement/to.php`;
    return this.http.post(url,$data, httpOptions).pipe();
  }
}
