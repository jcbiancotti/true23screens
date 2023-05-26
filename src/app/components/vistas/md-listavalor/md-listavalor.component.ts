import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Funciones, GlobalService } from 'src/app/servicios/global.service';

@Component({
  selector: 'app-md-listavalor',
  templateUrl: './md-listavalor.component.html',
  styleUrls: ['./md-listavalor.component.css']
})
export class MdListavalorComponent implements OnInit {

  id: string | null = '';
  rutaCrud2: string = "/listavalorvalor";
  rutaRetorno: string = "/in/listasdevalores";
  camposCrud1: any[] = [];
  columnasValores: any[] = [];
  tabla: string = "";

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

    this.tabla = "sys_modelo_datos";
        
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
      }
    ];   
    // Las columnas de la tabla de valores
    this.columnasValores = [
      {
        literal: "ID",
        ordenar: false,
        orden: false,
        campo: "id"
      },
      {
        literal: "Código",
        ordenar: false,
        orden: "none",
        campo: "codigo"
      },
      {
        literal: "Texto",
        ordenar: false,
        orden: "none",
        campo: "descripcion"
      },
      {
        literal: "Orden",
        ordenar: false,
        orden: "up",
        campo: "orden"
      }
    ];

  } 

}
