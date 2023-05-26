import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService, Funciones } from 'src/app/servicios/global.service';

@Component({
  selector: 'app-orq-rol',
  templateUrl: './orq-rol.component.html',
  styleUrls: ['./orq-rol.component.css']
})
export class OrqRolComponent implements OnInit {

  id: string | null = '';
  rutaRetorno: string = "/in/roles";
  camposCrud1: any[] = [];
  tabla: string = "sys_roles";

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
        requerido: true,
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
        campo: "es_admin",
        requerido: false,
        etiqueta: "Es administrador",
        valordefault: "",
        ancho: 1,
        formato: "B",
        disable: false,
        visible: true
      }

    ]
  }
  
}
