import { Component } from '@angular/core';
import { GlobalService, isLoggedFlagService } from 'src/app/servicios/global.service';

@Component({
  selector: 'app-usrcard',
  templateUrl: './usrcard.component.html',
  styleUrls: ['./usrcard.component.css']
})
export class UsrcardComponent {

  isLoggedUsercard: boolean = false;
  usuario: any = {};
  usrImagen: string = this.global.avatar_female;


  constructor(
    private global: GlobalService,
    private misLoggedFlagService: isLoggedFlagService) 
  { 
    this.misLoggedFlagService.misLogged$.subscribe(isLogged => {
      if(this.isLoggedUsercard != isLogged) {
        this.isLoggedUsercard = isLogged;    
        this.Refrescar();
      }
    });
  }

  ngOnInit() {}

  async Refrescar() {
  
    try {

      const response = await fetch(this.global.API_ROUTE + "auth/user_info.php", {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      });

      if (response.ok) {

        const usrcardResult = await response.json();

        if(this.global.DEBUG)
          console.log("Respuesta usrcard.ngOnInit:", usrcardResult);

        if(usrcardResult.success == 1 && usrcardResult.status == 200) {

          let ximg =  this.global.avatar_female;
          if(usrcardResult.data.imagen64 && usrcardResult.data.imagen64 != 'unknow.png' && usrcardResult.data.imagen64 != null) {
            ximg = usrcardResult.data.imagen64;
          }
          this.usuario = {
            nombre: usrcardResult.data.nombre,
            correo: usrcardResult.data.correo,
            roles: usrcardResult.data.roles,
            usrImagen: ximg,
          }


        }

      }

    } catch (err) {
      console.error(err);
    }

  }

}
