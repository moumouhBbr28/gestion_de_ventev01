import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders } from '@angular/common/http';


const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable()
export class ProduitsProvider {
  constructor(public http: HttpClient){ }

  getUsers(skip,size,$apiUrl){
 
    return this.http.get($apiUrl+"produits/catalogue_prod.php?skip="+skip+"&size="+size)
  }
  getUsers2(LIGNE,skip,size,$apiUrl){
 console.log('liiii',LIGNE);
    return this.http.get($apiUrl+"produits/catalogue_prod.php?skip="+skip+"&size="+size+"LIGNE="+LIGNE)
  }


 getAllProduits($apiUrl){
   return this.http.get($apiUrl+"produits/tousProduits.php")
 
 }
 getAllProduits2($DPROD,$apiUrl){
  return this.http.get($apiUrl+"produits/tousProduits-apartir.php?DPROD="+$DPROD)

}
getAllProduits3($DPROD,$apiUrl){
  return this.http.get($apiUrl+"produits/tousProduitsparcode.php?DPROD="+$DPROD)

}
getProdByReqequiv($DATASCANNED,$apiUrl){
  const url = $apiUrl+`devis/_getREFEQUIV.php`;
  return this.http.post(url, {"data_scanned":$DATASCANNED}, httpOptions).pipe();
}


 GetFeedSearching1 ($search,skip,size,$apiUrl) {
  const url = $apiUrl + "produits/recherche.php?skip="+skip+"&size="+size;
  return this.http.post(url, {'search': $search}, httpOptions).pipe();
}
GetFeedSearching ($search,$skip,$apiUrl) {
  const url = $apiUrl + "produits/recherche.php?skip=" + $skip + "&size=" + 20;
  return this.http.post(url, {'search': $search}, httpOptions).pipe();
}
}
