import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService, Funciones } from 'src/app/servicios/global.service';

@Component({
  selector: 'app-scr-buscador',
  templateUrl: './scr-buscador.component.html',
  styleUrls: ['./scr-buscador.component.css']
})
export class ScrBuscadorComponent implements OnInit {

  id: string | null = '';
  rutaCrud2: string = "/buscadorcampo";
  rutaRetorno = "/in/buscadores";
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
        literal: "Campo",
        ordenar: true,
        orden: false,
        campo: "campo"
      }
    ];


  }
  
}
