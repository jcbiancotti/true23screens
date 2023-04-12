import { Component, OnInit } from '@angular/core';
import { isLoggedFlagService, spinnerstatus } from './servicios/global.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'true23screens';

  isLogged: boolean = false;
  showspinner: boolean = false;

   constructor(
    private misLoggedFlagService: isLoggedFlagService,
    private switchspinner: spinnerstatus,  
  ) 
  {
    this.misLoggedFlagService.misLogged$.subscribe(isLogged => {
      this.isLogged = isLogged;    
    });
    this.switchspinner.$showSpinner.subscribe(valor => {
      this.showspinner = valor;
    });
        
  }
  
  ngOnInit(): void { }

}