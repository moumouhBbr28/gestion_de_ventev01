import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http'; 


const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable()
export class DevisProvider { 
  constructor(public http: HttpClient ){  }


  getDevis(skip,size,$apiUrl){
    return this.http.get($apiUrl+"devis/liste_devis.php?skip="+skip+"&size="+size)
  }

  getLastNumBon($apiUrl){
    return this.http.get($apiUrl+"devis/devis_num_bon.php")
  }

  postDevis(data,$apiUrl): Observable<any> {
    const url = $apiUrl+`devis/insert_devis.php`;
    return this.http.post(url, data, httpOptions).pipe();
  }

  getPuhtProdProvider($numbon,$apiUrl){
    const url = $apiUrl+`devis/_getPuhtProd.php`;
    return this.http.post(url, {"c_produit":$numbon}, httpOptions).pipe();
  }


  getTypeVentSelDevis($numbon,$apiUrl){
    const url = $apiUrl+`devis/_getTypeVentSelDevis.php`;
    return this.http.post(url, {"NUMBON":$numbon}, httpOptions).pipe();
  }

  d_proforma($numbon,$apiUrl){
    const url = $apiUrl+`devis/d_proforma.php`;
    return this.http.post(url, {"NUMBON":$numbon}, httpOptions).pipe();
  }

  valider_devis($numbon,$apiUrl){
    const url = $apiUrl+`devis/validerDevis.php`;
    return this.http.post(url, {"NUMBON":$numbon}, httpOptions).pipe();
  }

  devalider_devi($numbon,$apiUrl){
    const url = $apiUrl+`devis/devaliderDevis.php`;
    return this.http.post(url, {"NUMBON":$numbon}, httpOptions).pipe();
  }

  insert_produit_to_devis($data,$apiUrl){
    const url = $apiUrl+`devis/insert_produit_devis.php`;
    return this.http.post(url, $data, httpOptions).pipe();
  }

get_d_proforma_ParNumBon($numbon,$apiUrl){
  const url = $apiUrl+`devis/get_d_proforma_ParNumBon.php`;
    return this.http.post(url, {"NUMBON":$numbon}, httpOptions).pipe();
}

majTauxRemise($data,$apiUrl){
    const url = $apiUrl+`devis/majTauxRemise.php`;
    return this.http.post(url, $data, httpOptions).pipe();
}

delete_produit_devis($NUMBON,ORDRE,$apiUrl){
  const url = $apiUrl+`devis/delete_produit_devis.php`;
  return this.http.post(url, {"NUMBON":$NUMBON*1,"ORDRE":ORDRE*1}, httpOptions).pipe();
}

update_info_devis($data,$apiUrl){
  const url = $apiUrl+`devis/update_info_devis.php`;
  return this.http.post(url, $data, httpOptions).pipe();
}

getProduitDevis($NUMBON,$ORDRE,$apiUrl){
    const url = $apiUrl+`devis/select_par_produitOrdre_devis.php`;
    return this.http.post(url, {'NUMBON':$NUMBON,'ORDRE':$ORDRE }, httpOptions).pipe();
}

updateProduitDevis($data,$apiUrl){
    const url = $apiUrl+`devis/update_produit_devis.php`;
    return this.http.post(url, $data, httpOptions).pipe();
}

GetFeedSearching ($search,$skip,$apiUrl) {
    const url = $apiUrl + "devis/recherche.php?skip=" + $skip + "&size=" + 20;
    return this.http.post(url, {'search': $search}, httpOptions).pipe();
}

getTypeVenteCl ($c_client,$apiUrl) {
    const url = $apiUrl + "devis/dropdownTypVent.php";
    return this.http.post(url, {'c_client': $c_client}, httpOptions).pipe();
}

  getMontantRegle($numbon,$apiUrl) {
  const url = $apiUrl + "devis/getProformaParNUMBON.php";
  return this.http.post(url, {'NUMBON': $numbon}, httpOptions).pipe();
}


get_detail_totaux($numBon,$apiUrl){
  console.log('service',$numBon,$apiUrl)
  const url = $apiUrl+`devis/getDetailTotaux.php`;
  return this.http.post(url, {'numBon':$numBon}, httpOptions).pipe();
}

  }



