import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService, Funciones } from 'src/app/servicios/global.service';

@Component({
  selector: 'app-scr-crud1',
  templateUrl: './scr-crud1.component.html',
  styleUrls: ['./scr-crud1.component.css']
})
export class ScrCrud1Component implements OnInit {

  id: string | null = '';
  rutaCrud2: string = "/edicionregistrocolumna";
  rutaRetorno = "/in/edicionesregistros";
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

    this.tabla = "sys_screens";

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
        campo: "titulo",
        requerido: true,
        etiqueta: "Título de la pantalla",
        valordefault: "",
        ancho: 100,
        formato: "C",
        disable: false,
        visible: true
      },
      {
        id: this.funciones.generarUUID(""),
        campo: "subtitulo",
        requerido: false,
        etiqueta: "Subtítulo",
        valordefault: "",
        ancho: 100,
        formato: "C",
        disable: false,
        visible: true
      },
      {
        id: this.funciones.generarUUID(""),
        campo: "tabla",
        requerido: false,
        etiqueta: "Tabla principal",
        valordefault: "",
        ancho: 13,
        formato: "C",
        disable: true,
        visible: false
      },
      {
        id: this.funciones.generarUUID(""),
        campo: "nTabla",
        requerido: true,
        etiqueta: "Tabla principal",
        valordefault: "",
        ancho: 200,
        formato: "L",
        disable: false,
        visible: true,
        lista: "this.lEntDatos"
      }

    ];
    this.columnasValores = [
      {
        literal: "ID",
        ordenar: false,
        orden: false,
        campo: "id"
      },
      {
        literal: "Etiqueta",
        ordenar: true,
        orden: false,
        campo: "etiqueta"
      },
      {
        literal: "Campo",
        ordenar: true,
        orden: false,
        campo: "campo"
      },
      {
        literal: "Formato",
        ordenar: true,
        orden: false,
        campo: "nformato"
      },
      {
        literal: "Valor inicial",
        ordenar: true,
        orden: false,
        campo: "valdefault"
      },
      {
        literal: "Habilitado",
        ordenar: true,
        orden: false,
        campo: "enabledinicial"
      },
      {
        literal: "Requerido",
        ordenar: true,
        orden: false,
        campo: "requerido"
      },
      {
        literal: "Ancho",
        ordenar: true,
        orden: false,
        campo: "ancho"
      },
      {
        literal: "Decimales",
        ordenar: true,
        orden: false,
        campo: "decimales"
      },
      {
        literal: "Lista de valores",
        ordenar: true,
        orden: false,
        campo: "nlistaval"
      },
      {
        literal: "Lista seleccionable",
        ordenar: true,
        orden: false,
        campo: "nselectable"
      }
    ];


  }


}
