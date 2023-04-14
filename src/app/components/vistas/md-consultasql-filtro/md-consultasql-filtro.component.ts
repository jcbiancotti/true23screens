import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService, Funciones } from 'src/app/servicios/global.service';

@Component({
  selector: 'app-md-consultasql-filtro',
  templateUrl: './md-consultasql-filtro.component.html',
  styleUrls: ['./md-consultasql-filtro.component.css']
})
export class MdConsultasqlFiltroComponent implements OnInit {

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

    this.rutaRetorno = "/in/consultasql/";
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
        id: "tipo",
        etiqueta: "Tipo",
        campo: "tipo",
        requerido: true,
        valordefault: '',
        visible: true,
        disabled: false,
        ancho: 15,
        formato: "L",
      },
      {
        id: "campo",
        etiqueta: "Variable en la consulta",
        campo: "campo",
        requerido: true,
        valordefault: '',
        visible: true,
        disabled: false,
        ancho: 50,
        formato: "C",
      },
      {
        id: "obligatorio",
        etiqueta: "Obligatorio",
        campo: "obligatorio",
        requerido: false,
        valordefault: '',
        visible: true,
        disabled: false,
        ancho: 1,
        formato: "B",   // B = Boolean -> checkbox
      }
    ];

  }

}
