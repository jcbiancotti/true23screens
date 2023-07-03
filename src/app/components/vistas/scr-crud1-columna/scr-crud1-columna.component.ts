import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Funciones, GlobalService } from 'src/app/servicios/global.service';

@Component({
  selector: 'app-scr-crud1-columna',
  templateUrl: './scr-crud1-columna.component.html',
  styleUrls: ['./scr-crud1-columna.component.css']
})
export class ScrCrud1ColumnaComponent implements OnInit {

  id: string | null = '';
  idvalor: string | null = '';
  crud2Campos: any[] = [];
  crud2Columnas: any[] = [];
  rutaRetorno: string = "";

  constructor ( 
    private global: GlobalService,
    private funciones: Funciones,
    private route: ActivatedRoute,
  ) {
    this.id = route.snapshot.params['id'];
    this.idvalor = route.snapshot.params['idvalor'];

    if(this.global.DEBUG)
      console.log("Datos recibidos ID:", this.id , "IDvalor:", this.idvalor);

  }
  ngOnInit(): void {

    this.rutaRetorno = "/in/edicionregistro/";
    this.crud2Campos = [
      {
        id: "id",
        etiqueta: "ID",
        campo: "id",
        requerido: false,
        valordefault: '',
        visible: false,
        disabled: true,
        ancho: 13,
        formato: "C",
      },
      {
        id: "etiqueta",
        etiqueta: "Etiqueta",
        campo: "etiqueta",
        requerido: true,
        valordefault: '',
        visible: true,
        disabled: false,
        ancho: 50,
        formato: "C",
      },
      {
        id: "campo",
        etiqueta: "Campo",
        campo: "campo",
        requerido: true,
        valordefault: '',
        visible: true,
        disabled: false,
        ancho: 50,
        formato: "C",
      },
      {
        id: "orden",
        etiqueta: "Orden en la pantalla",
        campo: "orden",
        requerido: true,
        valordefault: '',
        visible: true,
        disabled: false,
        ancho: 3,
        formato: "C",
      },
      {
        id: "formato",
        etiqueta: "Formato",
        campo: "formato",
        requerido: false,
        valordefault: '',
        visible: false,
        disabled: false,
        ancho: 1,
        formato: "C",
      },
      {
        id: "nformato",
        etiqueta: "Formato",
        campo: "nformato",
        requerido: true,
        valordefault: '',
        visible: true,
        disabled: false,
        ancho: 30,
        formato: "L",
        lista: null
      },      
      {
        id: "valdefault",
        etiqueta: "Valor inicial",
        campo: "valdefault",
        requerido: false,
        valordefault: '',
        visible: true,
        disabled: false,
        ancho: 50,
        formato: "C",
      },
      {
        id: "enabledinicial",
        etiqueta: "Habilitado",
        campo: "enabledinicial",
        requerido: false,
        valordefault: '',
        visible: true,
        disabled: false,
        ancho: 1,
        formato: "B",
      },
      {
        id: "requerido",
        etiqueta: "Requerido",
        campo: "requerido",
        requerido: false,
        valordefault: '',
        visible: true,
        disabled: false,
        ancho: 1,
        formato: "B",
      },
      {
        id: "ancho",
        etiqueta: "Ancho",
        campo: "ancho",
        requerido: true,
        valordefault: '',
        visible: true,
        disabled: false,
        ancho: 10,
        formato: "N",
      },
      {
        id: "decimales",
        etiqueta: "Decimales",
        campo: "decimales",
        requerido: false,
        valordefault: '',
        visible: true,
        disabled: false,
        ancho: 1,
        formato: "N",
      },
      {
        id: "listaval",
        etiqueta: "Lista de valores",
        campo: "listaval",
        requerido: false,
        valordefault: '',
        visible: false,
        disabled: false,
        ancho: 13,
        formato: "C",
      },
      {
        id: "nlistaval",
        etiqueta: "Lista de valores",
        campo: "nlistaval",
        requerido: false,
        valordefault: '',
        visible: true,
        disabled: false,
        ancho: 100,
        formato: "L",
        lista: null
      },
      {
        id: "selectable",
        etiqueta: "Lista seleccionable",
        campo: "selectable",
        requerido: false,
        valordefault: '',
        visible: false,
        disabled: false,
        ancho: 13,
        formato: "C"
      },
      {
        id: "nselectable",
        etiqueta: "Lista seleccionable",
        campo: "nselectable",
        requerido: false,
        valordefault: '',
        visible: true,
        disabled: false,
        ancho: 100,
        formato: "L",
        lista: null
      },
      {
        id: "BSquery",
        etiqueta: "Query del ButtonList",
        campo: "BSquery",
        requerido: false,
        valordefault: '',
        visible: false,
        disabled: false,
        ancho: 13,
        formato: "C"
      },
      {
        id: "nBSquery",
        etiqueta: "Query del ButtonList",
        campo: "nBSquery",
        requerido: false,
        valordefault: '',
        visible: true,
        disabled: false,
        ancho: 100,
        formato: "L",
        lista: null
      }
    ];

  }
  
}
  