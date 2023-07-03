import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Funciones, GlobalService } from 'src/app/servicios/global.service';

@Component({
  selector: 'app-scr-listado',
  templateUrl: './scr-listado.component.html',
  styleUrls: ['./scr-listado.component.css']
})
export class ScrListadoComponent implements OnInit {

  id: string | null = '';
  rutaCrud2: string = "/listadocolumna";
  rutaRetorno = "/in/listados";
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

    this.tabla = "sys_screens"

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
        etiqueta: "Título del listado",
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
        campo: "idQuery",
        requerido: false,
        etiqueta: "Consulta a utilizar",
        valordefault: "",
        ancho: 13,
        formato: "C",
        disable: true,
        visible: false
      },
      {
        id: this.funciones.generarUUID(""),
        campo: "nQuery",
        requerido: true,
        etiqueta: "Consulta a utilizar",
        valordefault: "",
        ancho: 200,
        formato: "L",
        disable: false,
        visible: true,
        lista: "this.lQueries"
      },
      {
        id: this.funciones.generarUUID(""),
        campo: "orientacion",
        requerido: true,
        etiqueta: "Orientación",
        valordefault: "V",
        ancho: 1,
        formato: "C",
        disable: false,
        visible: false,
      },
      {
        id: this.funciones.generarUUID(""),
        campo: "norientacion",
        requerido: true,
        etiqueta: "Orientación",
        valordefault: "Vertical",
        ancho: 15,
        formato: "L",
        disable: false,
        visible: true,
        lista: "this.orientaciones"
      },
    ];
    this.columnasValores = [
      {
        literal: "ID",
        ordenar: false,
        orden: false,
        campo: "id"
      },
      {
        literal: "Título",
        ordenar: false,
        orden: false,
        campo: "titulo"
      },
      {
        literal: "Campo",
        ordenar: false,
        orden: false,
        campo: "campo"
      },
      {
        literal: "Ancho",
        ordenar: false,
        orden: false,
        campo: "ancho"
      }
    ];

  }

}
