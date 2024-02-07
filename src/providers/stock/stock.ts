import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable()
export class StockProvider {
  apiUrl: string;
  constructor(public http: HttpClient ){ }

  getUsers(skip,size,apiUrl){
  return this.http.get(apiUrl+"stock/stock.php?skip="+skip+"&size="+size);
  }

  getAllProducts(apiUrl){
    return this.http.get(apiUrl+"stock/allProducts.php")
  }

  GetFeedSearching ($search,$skip,apiUrl) {
    const url = apiUrl + "stock/recherche.php?skip=" + $skip + "&size=" + 20;
    return this.http.post(url, {'search': $search}, httpOptions).pipe();
  }

  getQteByCodeProd($code_prod,$mag,apiUrl) {
    const url = apiUrl + "stock/getQteByCodeProd.php";
    return this.http.post(url, {'c_produit': $code_prod,'mag': $mag}, httpOptions).pipe();
  }

}
