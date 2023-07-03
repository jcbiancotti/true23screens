import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Funciones, GlobalService } from 'src/app/servicios/global.service';

@Component({
  selector: 'app-scr-crud0-columna',
  templateUrl: './scr-crud0-columna.component.html',
  styleUrls: ['./scr-crud0-columna.component.css']
})
export class ScrCrud0ColumnaComponent implements OnInit {
  
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
  
      this.rutaRetorno = "/in/tabladegestion/";
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
          id: "titulo",
          etiqueta: "Título",
          campo: "titulo",
          requerido: true,
          valordefault: '',
          visible: true,
          disabled: false,
          ancho: 50,
          formato: "C"
        },
        {
          id: "campo",
          etiqueta: "Campo",
          campo: "campo",
          requerido: true,
          valordefault: '',
          visible: true,
          disabled: false,
          ancho: 15,
          formato: "C"
        },
        {
          id: "ordenar",
          etiqueta: "Ordenable",
          campo: "ordenar",
          requerido: false,
          valordefault: '',
          visible: true,
          disabled: false,
          ancho: 1,
          formato: "B"
        },
      ];
  
    }
  
  }
