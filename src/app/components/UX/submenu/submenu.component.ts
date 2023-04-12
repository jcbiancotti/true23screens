import { Component, OnInit } from '@angular/core';
import { GlobalService, isLoggedFlagService, sistemStatusService } from 'src/app/servicios/global.service';

@Component({
  selector: 'app-submenu',
  templateUrl: './submenu.component.html',
  styleUrls: ['./submenu.component.css']
})
export class SubmenuComponent implements OnInit {

  isLoggedSubmenu: boolean = false;
  lSistemStatus =  {status: '', texto: ''};

  constructor(
    private global: GlobalService,
    private misLoggedFlagService: isLoggedFlagService, 
    private statusmensaje: sistemStatusService,
  )
  { 
    this.misLoggedFlagService.misLogged$.subscribe(isLogged => {
      this.isLoggedSubmenu = isLogged;    
    });
    this.statusmensaje.mMensaje$.subscribe(pMsje => {
      if(pMsje != this.lSistemStatus) {
          this.lSistemStatus = pMsje;    
          setTimeout(() => {this.lSistemStatus = {status: '', texto: ''}; }, 8000);
      }
    });
  }
  ngOnInit(): void {
  }



}

