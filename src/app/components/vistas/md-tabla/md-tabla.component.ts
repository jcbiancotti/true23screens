import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Funciones, GlobalService } from 'src/app/servicios/global.service';

@Component({
  selector: 'app-md-tabla',
  templateUrl: './md-tabla.component.html',
  styleUrls: ['./md-tabla.component.css']
})
export class MdTablaComponent implements OnInit {

  id: string | null = '';
  rutaCrud2: string = "/tablacampo";
  rutaRetorno = "/in/tablas";
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
      },
      {
        id: this.funciones.generarUUID(""),
        campo: "tabla",
        requerido: true,
        etiqueta: "Nombre de la tabla en BBDD",
        valordefault: "",
        ancho: 100,
        formato: "T",
        disable: false,
        visible: true,
        lista: "this.tablasBBDD"
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
        literal: "Etiqueta",
        ordenar: false,
        orden: "up",
        campo: "etiqueta"
      },
      {
        literal: "Nombre del campo",
        ordenar: false,
        orden: "none",
        campo: "nombre"
      },
      {
        literal: "Tipo",
        ordenar: false,
        orden: "none",
        campo: "ntipo"
      },
      {
        literal: "Ancho",
        ordenar: false,
        orden: "none",
        campo: "ancho"
      },
      {
        literal: "Decimales",
        ordenar: false,
        orden: "none",
        campo: "decimales"
      },
      {
        literal: "Valor inicial",
        ordenar: false,
        orden: "none",
        campo: "default"
      }
    ];

  } 
  
}
