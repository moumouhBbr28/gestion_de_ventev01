import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};


@Injectable()
export class CreanceClientProvider {

  constructor(public http: HttpClient) {
  
    
  }
  getCreanceClient(skip,size,$apiUrl){

    return this.http.get($apiUrl+"creance/creanceclient.php?skip="+skip+"&size="+size);

    
  }

  GetFeedSearching ($search,$skip,$apiUrl) {
    const url = $apiUrl + "creance/recherche_creance_client.php?skip=" + $skip + "&size=" + 3;
    return this.http.post(url, {'search': $search}, httpOptions).pipe();
  }
}
