import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Funciones, GlobalService } from 'src/app/servicios/global.service';

@Component({
  selector: 'app-scr-crud0',
  templateUrl: './scr-crud0.component.html',
  styleUrls: ['./scr-crud0.component.css']
})
export class ScrCrud0Component implements OnInit {

  id: string | null = '';
  rutaCrud2: string = "/tabladegestioncolumna";
  rutaRetorno = "/in/tablasdegestion";
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

    // Los campos del formulario principal del registro
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
        lista: "this.lEntDatos"
      },
      {
        id: this.funciones.generarUUID(""),
        campo: "rowAgregar",
        requerido: false,
        etiqueta: "Opción de agregar",
        valordefault: "",
        ancho: 10,
        formato: "B",
        disable: false,
        visible: true
      },
      {
        id: this.funciones.generarUUID(""),
        campo: "rowEditar",
        requerido: false,
        etiqueta: "Opción de editar",
        valordefault: "",
        ancho: 10,
        formato: "B",
        disable: false,
        visible: true
      },
      {
        id: this.funciones.generarUUID(""),
        campo: "rowListar",
        requerido: false,
        etiqueta: "Opción de Listado",
        valordefault: "",
        ancho: 10,
        formato: "B",
        disable: false,
        visible: true
      },
      {
        id: this.funciones.generarUUID(""),
        campo: "rutaAdd",
        requerido: false,
        etiqueta: "Ruta para agregar ( Router /...)",
        valordefault: "",
        ancho: 50,
        formato: "C",
        disable: false,
        visible: true
      },
      {
        id: this.funciones.generarUUID(""),
        campo: "pantallaAdd",
        requerido: false,
        etiqueta: "Pantalla de agregar",
        valordefault: "",
        ancho: 13,
        formato: "C",
        disable: false,
        visible: false
      },
      {
        id: this.funciones.generarUUID(""),
        campo: "npantallaAdd",
        requerido: true,
        etiqueta: "Pantalla de agregar",
        valordefault: "",
        ancho: 200,
        formato: "L",
        disable: false,
        visible: true,
        lista: "this.lPantallas"
      },
      {
        id: this.funciones.generarUUID(""),
        campo: "rutaEdit",
        requerido: false,
        etiqueta: "Ruta para editar ( Router /...)",
        valordefault: "",
        ancho: 50,
        formato: "C",
        disable: false,
        visible: true
      },
      {
        id: this.funciones.generarUUID(""),
        campo: "pantallaEdit",
        requerido: false,
        etiqueta: "Pantalla de edición",
        valordefault: "",
        ancho: 13,
        formato: "C",
        disable: false,
        visible: false
      },
      {
        id: this.funciones.generarUUID(""),
        campo: "npantallaEdit",
        requerido: true,
        etiqueta: "Pantalla de editar",
        valordefault: "",
        ancho: 200,
        formato: "L",
        disable: false,
        visible: true,
        lista: "this.lPantallas"
      },
      {
        id: this.funciones.generarUUID(""),
        campo: "pantallaList",
        requerido: false,
        etiqueta: "Definición del listado",
        valordefault: "",
        ancho: 13,
        formato: "C",
        disable: false,
        visible: false
      },
      {
        id: this.funciones.generarUUID(""),
        campo: "npantallaList",
        requerido: true,
        etiqueta: "Pantalla de listado",
        valordefault: "",
        ancho: 200,
        formato: "L",
        disable: false,
        visible: true,
        lista: "this.lPantallas"
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
        literal: "Título",
        ordenar: true,
        orden: false,
        campo: "titulo"
      },
      {
        literal: "Campo",
        ordenar: true,
        orden: false,
        campo: "campo"
      },
      {
        literal: "Ordenable",
        ordenar: true,
        orden: false,
        campo: "ordenar"
      }
    ];

  } 
  
}