import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable()
export class ConversionProvider {
  constructor(public http: HttpClient){ }


  appliquer($data , apiUrl){
    const url = apiUrl+`conversion/convertDevisInto.php`;
    console.log('conversion',$data)
    return this.http.post(url,$data, httpOptions).pipe();
  }


  convertBonLivraison($data , apiUrl){
    const url = apiUrl+`conversion/convertBLInto.php`;
    console.log('conversion',$data)
    return this.http.post(url,$data, httpOptions).pipe();
  }
  
  convertCommandeClient($data , apiUrl){
    const url = apiUrl+`conversion/convertCommandeInto.php`;
    console.log('conversion',$data)
    return this.http.post(url,$data, httpOptions).pipe();
  }
  convertFacture($data , apiUrl){
    const url = apiUrl+`conversion/convertFactureInto.php`;
    console.log('conversion',$data)
    return this.http.post(url,$data, httpOptions).pipe();
  }
  
  
  
  convertCommandeInto


}
