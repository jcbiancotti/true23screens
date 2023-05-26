import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService, Funciones } from 'src/app/servicios/global.service';

@Component({
  selector: 'app-orq-opcionmenu',
  templateUrl: './orq-opcionmenu.component.html',
  styleUrls: ['./orq-opcionmenu.component.css']
})
export class OrqOpcionmenuComponent implements OnInit {

  id: string | null = '';
  rutaRetorno: string = "/in/opcionesmenu";
  camposCrud1: any[] = [];
  tabla: string = "sys_menu23";

  constructor ( 
    private global: GlobalService,
    private funciones: Funciones,
    private route: ActivatedRoute,
  ) {
    
    this.id = route.snapshot.params['id'];

    if(this.global.DEBUG)
      console.log("Datos recibidos ID:", this.id);

  }

  ngOnInit(): void {

    this.camposCrud1 = [
      {
        id: this.funciones.generarUUID(""),
        campo: "id",
        requerido: false,
        etiqueta: "ID",
        valordefault: "",
        ancho: 13,
        formato: "C",
        disable: true,
        visible: false
      },
      {
        id: this.funciones.generarUUID(""),
        campo: "descripcion",
        requerido: true,
        etiqueta: "Descripción",
        valordefault: "",
        ancho: 100,
        formato: "C",
        disable: false,
        visible: true
      },
      {
        id: this.funciones.generarUUID(""),
        campo: "pantalla",
        requerido: false,
        etiqueta: "Pantalla",
        valordefault: "",
        ancho: 150,
        formato: "L",
        disable: false,
        visible: true,
        listQuery: "646f5db90d2b5",
        lista: [],
        valtemp: ""
      },
      {
        id: this.funciones.generarUUID(""),
        campo: "padre",
        requerido: false,
        etiqueta: "Opción padre",
        valordefault: "",
        ancho: 150,
        formato: "L",
        disable: false,
        visible: true,
        listQuery: "6463a5631a8a0",
        lista: [],
        valtemp: ""
      },
      {
        id: this.funciones.generarUUID(""),
        campo: "ruta",
        requerido: false,
        etiqueta: "Ruta (Router: /...)",
        valordefault: "",
        ancho: 100,
        formato: "C",
        disable: false,
        visible: true
      },
      {
        id: this.funciones.generarUUID(""),
        campo: "roles",
        requerido: false,
        etiqueta: "Opción disponible en los siguientes roles de usuario",
        valordefault: "",
        ancho: 500,
        formato: "J",
        disable: false,
        visible: true,
        addQuery: "646dedd830345"
      }

    ]
  }
  
}

