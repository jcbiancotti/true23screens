import { Component, OnInit } from '@angular/core';
import { GlobalService, isLoggedFlagService, spinnerstatus } from './servicios/global.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ServicesApplications';

  isLogged: boolean = false;
  showspinner: boolean = false;

  constructor(
    private global: GlobalService,
    private misLoggedFlagService: isLoggedFlagService,
    private switchspinner: spinnerstatus, 
    private http: HttpClient,
  ) 
  {
    this.misLoggedFlagService.misLogged$.subscribe(isLogged => {
      this.isLogged = isLogged;    
    });
    this.switchspinner.$showSpinner.subscribe(valor => {
      this.showspinner = valor;
    });
        
  }
  
  ngOnInit(): void { 
    this.readFileContent();
  }

  readFileContent() {
    this.http.get('./assets/entorno.txt', { responseType: 'text' })
      .subscribe((data: string) => {
        console.log("ENTORNO:", data); 
        this.global.setVariablesGlobales(data);
      });
  }

}