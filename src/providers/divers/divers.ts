import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core'; 

@Injectable()
export class diversProvider {
  apiUrl: string;
  constructor(public http: HttpClient ){  }


  getPays($apiUrl){
    return this.http.get($apiUrl+"pays/index.php");
  }
  getVille($apiUrl){
    return this.http.get($apiUrl+"ville/index.php");
  }
  getFormeJuri($apiUrl){
    return this.http.get($apiUrl+"formej/index.php");
  }
  getSecteurA($apiUrl){
    return this.http.get($apiUrl+"secteura/index.php");
  }
  getTarifs($apiUrl){
    return this.http.get($apiUrl+"tarifs/index.php");
  }
  getCommercials($apiUrl){
    return this.http.get($apiUrl+"commercials/index.php");
  }

  getModePaie($apiUrl){
    return this.http.get($apiUrl+"modepaie/index.php");
  }

 getMagasins($apiUrl){
    return this.http.get($apiUrl+"magasin/index.php");
  }
}
