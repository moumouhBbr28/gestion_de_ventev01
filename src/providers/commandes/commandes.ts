import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http'; 

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable()
export class CommandesProvider {

  constructor(public http: HttpClient){ }

  getcommandes_clients(skip,size,$apiUrl){
    return this.http.get($apiUrl+"commandes_clients/liste_commandes_cl.php?skip="+skip+"&size="+size)
  }

  getLastNumBon($apiUrl){
    return this.http.get($apiUrl+"commandes_clients/commandes_num_bon.php")
  }

  postCmd(data , $apiUrl): Observable<any> {
    const url = $apiUrl+`commandes_clients/ajout_commandes.php`;
    return this.http.post(url, data, httpOptions).pipe();
  }


  d_commandesCl($numbon , $apiUrl){
    const url = $apiUrl+`commandes_clients/d_commandesCl.php`;
    return this.http.post(url, {"NUMBON":$numbon}, httpOptions).pipe();
  }

  valider($numbon , $apiUrl){
    const url = $apiUrl+`commandes_clients/valider.php`;
    return this.http.post(url, {"NUMBON":$numbon}, httpOptions).pipe();
  }
  devalider($numbon , $apiUrl){
    const url = $apiUrl+`commandes_clients/devalider.php`;
    return this.http.post(url, {"NUMBON":$numbon}, httpOptions).pipe();
  }

  insert_produit_to_cmd($data , $apiUrl){
    const url = $apiUrl+`commandes_clients/insert_produit_cmd.php`;
    return this.http.post(url, $data, httpOptions).pipe();
  }
  getTypeVentSelCmd($numbon , $apiUrl){
    const url = $apiUrl+`commandes_clients/getDataByCmdc.php`;
    return this.http.post(url, {"NUMBON":$numbon}, httpOptions).pipe();
  }

get_d_cmd_ParNumBon($numbon , $apiUrl){
  const url = $apiUrl+`commandes_clients/getDcomcByNbon.php`;
    return this.http.post(url, {"NUMBON":$numbon}, httpOptions).pipe();
}

get_Reglement_by_NumBon($numbon , $apiUrl){
  const url = $apiUrl+`commandes_clients/getReglementFromPaiement.php`;
    return this.http.post(url, {"NUMBON":$numbon}, httpOptions).pipe();
}

majTauxRemise($data , $apiUrl){
 const url = $apiUrl+`commandes_clients/majTauxRemise.php`;
    return this.http.post(url, $data, httpOptions).pipe();
}

delete_produit_commandes_clients($NUMBON,ORDRE , $apiUrl){
const url = $apiUrl+`commandes_clients/delete_produit_cmd.php`;
return this.http.post(url, {"NUMBON":$NUMBON*1,"ORDRE":ORDRE*1}, httpOptions).pipe();
}

update_info_commandes_clients($data,$apiUrl){
  const url = $apiUrl+`commandes_clients/update_info_cmd.php`;
  return this.http.post(url, $data, httpOptions).pipe();
}

getProduitcommandes_clients($NUMBON,$ORDRE,$apiUrl){
    const url = $apiUrl+`commandes_clients/getDcomcByProduits.php`;
    return this.http.post(url, {'NUMBON':$NUMBON,'ORDRE':$ORDRE }, httpOptions).pipe();
  }

updateProduitcommandes_clients($data,$apiUrl){
    const url = $apiUrl+`commandes_clients/update_produit_cmd.php`;
    return this.http.post(url, $data, httpOptions).pipe();
}

GetFeedSearching ($search,$skip,$apiUrl) {
    const url = $apiUrl +
     "commandes_clients/recherche.php?skip=" + $skip + "&size=" + 20;
    return this.http.post(url, {'search': $search}, httpOptions).pipe();
}


getCmdFromDevis($data,$apiUrl){
    const url = $apiUrl+`commandes_clients/importDevisIntoCmd.php`;
    return this.http.post(url, $data, httpOptions).pipe();
}

importDevisIntoCmd ($nb_devis,$nb_cmd,$apiUrl) {
    const url = $apiUrl +"commandes_clients/importDevisIntoCmd.php";
    return this.http.post(url, {'NUMBON_devis': $nb_devis , 'NUMBON_comma': $nb_cmd}, httpOptions).pipe();
  }

  get_detail_totaux($numBon,$apiUrl){
    console.log('service',$numBon,$apiUrl)
    const url = $apiUrl+`commandes_clients/getDetailTotaux.php`;
    return this.http.post(url, {'numBon':$numBon}, httpOptions).pipe();
  }
}



