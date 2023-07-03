import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataAccessService } from 'src/app/servicios/data-access.service';
import { GlobalService, spinnerstatus } from 'src/app/servicios/global.service';


@Component({
  selector: 'app-in',
  templateUrl: './in.component.html',
  styleUrls: ['./in.component.css']
})
export class InComponent implements OnInit {

  open = false;
  opciones: any[] = [];
  spinnershow: boolean = false;

  constructor(
    private router: Router,
    private global: GlobalService,
    private dataaccess: DataAccessService,
    private switchSpinner: spinnerstatus,

  ) {
    this.switchSpinner.$showSpinner.subscribe(mostrar => {
      this.spinnershow = mostrar;    
    }); 

  }  

  async ngOnInit() {
      
    // Mantener open/no open
    if(localStorage.getItem('sidemenuOpen')) {
      if(localStorage.getItem('sidemenuOpen') == 'false') {
        this.open = false;
      } else {
        this.open = true;
      }
    }

    // Recuperar opciones del menu
    const xopciones = await this.dataaccess.opcionesMenu_Servicio();

    if(this.global.DEBUG)
      console.log("Definición del menu:", xopciones);

    this.opciones = xopciones;  ///.data;
               


  
  }

  changeOpen() {
    
    this.open = !this.open;
    
    let xopen = 'false';
    if(this.open)
      xopen = 'true';

    localStorage.setItem('sidemenuOpen', xopen);
  
  }

  go(opcion: any) {
 
    let ruta = opcion.ruta;

    let idopcion = '';
    if(opcion.ruta == '' || opcion.ruta == '/') {
      idopcion = '/in';
    } else {
      idopcion = "/in" + ruta;  // + '/' + opcion.id;
    }

    if(this.global.DEBUG)
      console.log("Ir a ", idopcion);

    this.router.navigateByUrl(idopcion);

  }


// ///////////////////////////////////////////////////////////////////////////////

// ///////////////////////////////////////////////////////////////////////////////

}

