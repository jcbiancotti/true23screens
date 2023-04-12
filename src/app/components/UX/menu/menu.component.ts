import { Component } from '@angular/core';
import { isLoggedFlagService } from 'src/app/servicios/global.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {

  menuLogged = false;

  constructor(
    private misLoggedFlagService: isLoggedFlagService,
  ) {
    this.misLoggedFlagService.misLogged$.subscribe(isLogged => {
      this.menuLogged = isLogged;    
    });
  }

}