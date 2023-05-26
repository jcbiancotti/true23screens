import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Funciones, GlobalService } from 'src/app/servicios/global.service';

@Component({
  selector: 'app-md-listaseleccionable',
  templateUrl: './md-listaseleccionable.component.html',
  styleUrls: ['./md-listaseleccionable.component.css']
})
export class MdListaseleccionableComponent implements OnInit {

  id: string | null = '';
  rutaRetorno: string = "/in/listasseleccionables";
  camposCrud1: any[] = [];
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
        campo: "campo_valor",
        requerido: true,
        etiqueta: "Campo para el valor",
        valordefault: "",
        ancho: 100,
        formato: "C",
        disable: false,
        visible: true
      },
      {
        id: this.funciones.generarUUID(""),
        campo: "campo_descripcion",
        requerido: true,
        etiqueta: "Campo para la descripción",
        valordefault: "",
        ancho: 100,
        formato: "C",
        disable: false,
        visible: true
      }
    ]
  } 

}
