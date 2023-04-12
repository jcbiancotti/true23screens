import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { GlobalService, isLoggedFlagService, sistemStatusService } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class GuardInGuard implements CanActivate {

  isLogged: boolean = false;
  sistemstatusmensaje = {status:'', texto:''};

  constructor(
    private global: GlobalService, 
    private router: Router,
    private misLoggedFlagService: isLoggedFlagService,
    private statusmensaje: sistemStatusService,
  ) {
    this.misLoggedFlagService.misLogged$.subscribe(isLogged => {
      this.isLogged = isLogged;    
    });
    this.statusmensaje.mMensaje$.subscribe(mMje => {
      this.sistemstatusmensaje = mMje;
    })
  }
  
  async canActivate() {

    try {

      // Comprobar si está logueado
      this.statusmensaje.updateSistemStatus({status:'',texto:''});
      
      const response = await fetch(this.global.API_ROUTE + "auth/user_info.php", {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      });

      if (response.ok) {

        const guardInResult = await response.json();

        if(this.global.DEBUG)
          console.log("Respuesta guard-in.canActivate:", guardInResult);

        if(guardInResult.success != 1 || guardInResult.status != 200) {
          this.misLoggedFlagService.updateLogguedStatus(false);
          this.router.navigateByUrl('/home');
          return false;
        }
        if(!this.isLogged) {
          this.misLoggedFlagService.updateLogguedStatus(true);
        }

        return true;

      }

      return true;

    } catch (err:any) {
      console.log(err);
      return false;
    }

  }

}

