import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http'; 


const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable()
export class BonLivraisonProvider {
 
  constructor(public http: HttpClient ){ }

  getcommandes_clients(skip, size , $apiUrl){
    return this.http.get($apiUrl+"bons_livraison/liste_bons_liv.php?skip="+skip+"&size="+size)
  }
  getEntete($apiUrl){
    return this.http.get($apiUrl+"bons_livraison/getEntete.php");
  }

  getLastNumBon($apiUrl){
    return this.http.get($apiUrl+"bons_livraison/bl_num_bon.php")
  }
  postCmd(data,$apiUrl): Observable<any> {
    const url = $apiUrl+`bons_livraison/ajoutBonsLiv.php`;
    return this.http.post(url, data, httpOptions).pipe();
  }

  d_commandesCl($numbon,$apiUrl){
    const url = $apiUrl+`bons_livraison/d_bon_livr.php`;
    return this.http.post(url, {"NUMBON":$numbon}, httpOptions).pipe();
  }

  valider($numbon,$apiUrl){
    const url = $apiUrl+`bons_livraison/valider.php`;
    return this.http.post(url, {"NUMBON":$numbon}, httpOptions).pipe();
  }
  devalider($numbon,$apiUrl){
    const url = $apiUrl+`bons_livraison/devalider.php`;
    return this.http.post(url, {"NUMBON":$numbon}, httpOptions).pipe();
  }

  insert_produit_to_cmd($data,$apiUrl){
    const url = $apiUrl+`bons_livraison/insert_produit_bl.php`;
    return this.http.post(url, $data, httpOptions).pipe();
  }
  getTypeVentSelCmd($numbon,$apiUrl){
    const url = $apiUrl+`bons_livraison/getDataByBonl.php`;
    return this.http.post(url, {"NUMBON":$numbon}, httpOptions).pipe();
  }

  get_d_cmd_ParNumBon($numbon,$apiUrl){
    const url = $apiUrl+`bons_livraison/getDbonLivrByNbon.php`;
      return this.http.post(url, {"NUMBON":$numbon}, httpOptions).pipe();
  }

  get_Reglement_by_NumBon($numbon , $apiUrl){
    const url = $apiUrl+`bons_livraison/getReglementFromPaiement.php`;
      return this.http.post(url, {"NUMBON":$numbon}, httpOptions).pipe();
  }

  majTauxRemise($data,$apiUrl){
   const url = $apiUrl+`bons_livraison/majTauxRemise.php`;
      return this.http.post(url, $data, httpOptions).pipe();
  }

  delete_produit_commandes_clients($NUMBON,ORDRE,$apiUrl){
  const url = $apiUrl+`bons_livraison/delete_produit_bl.php`;
  return this.http.post(url, {"NUMBON":$NUMBON*1,"ORDRE":ORDRE*1}, httpOptions).pipe();
  }

  update_info_commandes_clients($data,$apiUrl){
    const url = $apiUrl+`bons_livraison/update_info_bl.php`;
    return this.http.post(url, $data, httpOptions).pipe();
  }

  getProduitcommandes_clients($NUMBON,$ORDRE,$apiUrl){
      const url = $apiUrl+`bons_livraison/getDlivrByProduits.php`;
      return this.http.post(url, {'NUMBON':$NUMBON,'ORDRE':$ORDRE }, httpOptions).pipe();
    }

  updateProduitcommandes_clients($data,$apiUrl){
      const url = $apiUrl+`bons_livraison/update_produit_BL.php`;
      return this.http.post(url, $data, httpOptions).pipe();
  }

  GetFeedSearching ($search,$skip,$apiUrl) {
      const url = $apiUrl + "bons_livraison/recherche.php?skip=" + $skip + "&size="+20;
      return this.http.post(url, {'search': $search}, httpOptions).pipe();
  }

  GetFeedSearching1 ($search,skip,size,$apiUrl) {
    const url = $apiUrl + "clients/recherche.php?skip="+skip+"&size="+size;
    return this.http.post(url, {'search': $search}, httpOptions).pipe();
  }
  convertCmdIntoBL($nb_cmd,$nb_bl,$apiUrl){
    const url = $apiUrl+`bons_livraison/convertCmdIntoBL.php`;
    return this.http.post(url, {'NUMBON_cmd':$nb_cmd,'NUMBON_bl':$nb_bl }, httpOptions).pipe();
  }


  get_detail_totaux($numBon,$apiUrl){
    console.log('service',$numBon,$apiUrl)
    const url = $apiUrl+`bons_livraison/getDetailTotaux.php`;
    return this.http.post(url, {'numBon':$numBon}, httpOptions).pipe();
  }

  getAllMagasins($apiUrl){
    console.log('magasins provider:')
    return this.http.get($apiUrl+"magasin/index.php")
  }


  getMagByCode($c_mag,$apiUrl){
    console.log('code_mag_ts',$c_mag);
    const url = $apiUrl+`magasin/getMagbycode.php`;
    return this.http.post(url, {'c_mag':$c_mag}, httpOptions).pipe();
  }
}



