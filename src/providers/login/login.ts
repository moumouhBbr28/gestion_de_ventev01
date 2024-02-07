import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
 

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};


@Injectable()
export class LoginProvider { 
  
  constructor(public http: HttpClient ){  }

  login($username , $password,$apiUrl){
    const url = $apiUrl+`login/login.php`;
    return this.http.post(url, {"username":$username , "password":$password}, httpOptions).catch(this.handleError);
  }

  handleError(error: HttpErrorResponse) {
    return Observable.throw(error.message || 'Erreur serveur!');
  }


  inscription(data,$apiUrl){
    const url = $apiUrl+`login/inscription.php`;
    return this.http.post(url, {username: data.username,email: data.email,tel: data.tel,password: data.password}, httpOptions)
      .catch(this.handleError);
  }

}
