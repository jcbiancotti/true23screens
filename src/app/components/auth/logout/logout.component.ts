import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService, isLoggedFlagService } from 'src/app/servicios/global.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  logotuIsLogged: boolean = false;

  constructor(
    private global: GlobalService,
    private router: Router,
    private misLoggedFlagService: isLoggedFlagService,
  ) { 
      this.misLoggedFlagService.misLogged$.subscribe(isLogged => {
        this.logotuIsLogged = isLogged;    
      });  
    }

  ngOnInit(): void {}

  ngAfterViewInit() {

    // Borrar el token local
    localStorage.setItem("token", "");
    
    let resp = this.global.mensaje("Desconectado!", 'Hasta pronto!' , "I", "Aceptar", "");
    resp.afterClosed().subscribe(dlgResp => {
      this.router.navigateByUrl('/');
      this.misLoggedFlagService.updateLogguedStatus(false);
    })

  }
  
}
