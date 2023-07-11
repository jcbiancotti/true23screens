import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Funciones, GlobalService } from 'src/app/servicios/global.service';

@Component({
  selector: 'app-md-consultasql',
  templateUrl: './md-consultasql.component.html',
  styleUrls: ['./md-consultasql.component.css']
})
export class MdConsultasqlComponent implements OnInit {

  id: string | null = '';
  rutaCrud2: string = "/consultasqlfiltro";
  rutaRetorno: string = "/in/consultassql";
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
        etiqueta: "Descripcion",
        valordefault: "",
        ancho: 100,
        formato: "C",
        disable: false,
        visible: true
      },
      {
        id: this.funciones.generarUUID(""),
        campo: "cadenaSQL",
        requerido: true,
        etiqueta: "Cadena SQL",
        valordefault: "",
        ancho: 5000,
        formato: "A",
        disable: false, 
        visible: true
      },
      {
        id: this.funciones.generarUUID(""),
        campo: "idBuscador",
        requerido: false,
        etiqueta: "Buscador vinculado",
        valordefault: "",
        ancho: 13,
        formato: "C",
        disable: true,
        visible: false
      },
      {
        id: this.funciones.generarUUID(""),
        campo: "nBuscador",
        requerido: false,
        etiqueta: "Buscador vinculado",
        valordefault: "",
        ancho: 200,
        formato: "L",
        disable: false,
        visible: true,
        lista: "this.lBuscadores"
      },
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
        orden: "none",
        campo: "etiqueta"
      },
      {
        literal: "Tipo",
        ordenar: false,
        orden: "none",
        campo: "ntipo"
      },
      {
        literal: "Variable en la cadena",
        ordenar: false,
        orden: "none",
        campo: "campo"
      },
      {
        literal: "Obligatorio",
        ordenar: false,
        orden: "none",
        campo: "obligatorio"
      }
    ];
    
  } 

}
