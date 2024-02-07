import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable()
export class FactureVenteProvider {
  constructor(public http: HttpClient){}

  getfacturev(skip,size,$apiUrl){
    return this.http.get($apiUrl+"facturev/liste.php?skip="+skip+"&size="+size)
  }

  getLastNumBon($apiUrl){
    return this.http.get($apiUrl+"facturev/fc_num_bon.php")
  }

  get_Reglement_by_NumBon($numbon , $apiUrl){
    const url = $apiUrl+`facturev/getReglementFromPaiement.php`;
      return this.http.post(url, {"NUMBON":$numbon}, httpOptions).pipe();
  }


  postCmd(data,$apiUrl): Observable<any> {
    const url = $apiUrl+`facturev/ajout.php`;
    return this.http.post(url, data, httpOptions)
      .pipe();
  }


  d_commandesCl($numbon,$apiUrl){
    const url = $apiUrl+`facturev/detailsCl.php`;
    return this.http.post(url, {"NUMBON":$numbon}, httpOptions).pipe();
  }

  valider($numbon,$apiUrl){
    const url = $apiUrl+`facturev/valider.php`;
    return this.http.post(url, {"NUMBON":$numbon}, httpOptions).pipe();
  }
  devalider($numbon,$apiUrl){
    const url = $apiUrl+`facturev/devalider.php`;
    return this.http.post(url, {"NUMBON":$numbon}, httpOptions).pipe();
  }

  insert_produit_to_cmd($data,$apiUrl){
    console.log('data',$data)
    const url = $apiUrl+`facturev/insert_produit_cmd.php`;
    return this.http.post(url, $data, httpOptions).pipe();
  }
  getTypeVentSelCmd($numbon,$apiUrl){
    const url = $apiUrl+`facturev/getDataByDetails.php`;
    return this.http.post(url, {"NUMBON":$numbon}, httpOptions).pipe();
  }

  get_d_cmd_ParNumBon($numbon,$apiUrl){
    const url = $apiUrl+`facturev/getDcomcByNbon.php`;
    return this.http.post(url, {"NUMBON":$numbon}, httpOptions).pipe();
  }
  majTauxRemise($data , $apiUrl){
    const url = $apiUrl+`facturev/majTauxRemise.php`;
    return this.http.post(url, $data, httpOptions).pipe();
  }

  delete_produit_facturev($NUMBON,ORDRE , $apiUrl){
    const url = $apiUrl+`facturev/delete_produit_cmd.php`;
    return this.http.post(url, {"NUMBON":$NUMBON*1,"ORDRE":ORDRE*1}, httpOptions).pipe();
  }

  update_info_facturev($data ,  $apiUrl){
    const url = $apiUrl+`facturev/update_info_cmd.php`;
    return this.http.post(url, $data, httpOptions).pipe();
  }

  getProduitfacturev($NUMBON,$ORDRE ,  $apiUrl){
    const url = $apiUrl+`facturev/getDcomcByProduits.php`;
    return this.http.post(url, {'NUMBON':$NUMBON,'ORDRE':$ORDRE }, httpOptions).pipe();
  }

  updateProduitfacturev($data ,  $apiUrl){
    const url = $apiUrl+`facturev/update_produit_cmd.php`;
    return this.http.post(url, $data, httpOptions).pipe();
  }

  GetFeedSearching ($search,$skip ,  $apiUrl) {
    const url = $apiUrl +
      "facturev/recherche.php?skip=" + $skip + "&size=" + 20;
    return this.http.post(url, {'search': $search}, httpOptions).pipe();
  }

  setAvoirNon($numbon ,  $apiUrl){
    const url = $apiUrl+`facturev/setAvoirNon.php`;
    return this.http.post(url, {"NUMBON":$numbon}, httpOptions).pipe();
  }
  setAvoirOui($numbon ,  $apiUrl){
    const url = $apiUrl+`facturev/setAvoirOui.php`;
    return this.http.post(url, {"NUMBON":$numbon}, httpOptions).pipe();
  }

}



