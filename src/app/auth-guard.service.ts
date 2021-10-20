import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  isAuthenticate = false;
  public client_id = '21f24499-5493-4609-b204-f9181350de5d';
  public cliente_secret = 'drupal';
  constructor(private authService: AuthService, public router: Router) { }



  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot)
    : Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.isAuthenticate) {
      return true;
    } else {
      const token =sessionStorage.getItem('access_token');
      if (token !== null) {
        return true;
        var url = 'https://lab.estrenarvivienda.com/es/oauth/token';
        // var data = 'grant_type=password&client_id=1431780a-8799-4f29-9715-bfd6d03f7cc4&client_secret=estrenar&username='+localStorage.getItem('user_name')+'&password='+localStorage.getItem('password');
        var urlencoded = new URLSearchParams();
        urlencoded.append("grant_type", "password");
        urlencoded.append("client_id", this.client_id);
        urlencoded.append("client_secret", this.cliente_secret);
        urlencoded.append("username", sessionStorage.getItem('username'));
        urlencoded.append("password", sessionStorage.getItem('password'));
          fetch(url, {
            body: urlencoded,
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            redirect: 'follow',
          })
          .then(function (a) {
              return a.json();
          })
        .then(result => {
          // console.log('result',result)
          if(result.access_token){
            var now = new Date();
            now.setSeconds(now.getSeconds() + result.expires_in)
            var timeObject = {
              time : now
            };
            sessionStorage.removeItem('access_token');
            sessionStorage.removeItem('time_out');
            sessionStorage.setItem('access_token',result.access_token);
            sessionStorage.setItem('time_out',JSON.stringify(timeObject));
            sessionStorage.setItem('access','ok');
            console.log('entre al access en el post y es: ', sessionStorage.getItem('access'))
            return true;
          }
        });
        if(sessionStorage.getItem('access') === 'ok'){
          console.log('entre al access y es: ', sessionStorage.getItem('access'))
          return true;
        }
      }else{
        this.router.navigate(['login']);
        return false;
      }
    }
  }
}
