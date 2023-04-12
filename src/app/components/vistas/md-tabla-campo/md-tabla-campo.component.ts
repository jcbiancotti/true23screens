import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Funciones, GlobalService } from 'src/app/servicios/global.service';

@Component({
  selector: 'app-md-tabla-campo',
  templateUrl: './md-tabla-campo.component.html',
  styleUrls: ['./md-tabla-campo.component.css']
})
export class MdTablaCampoComponent implements OnInit {

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

    this.rutaRetorno = "/in/tabla/";
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
        id: "nombre",
        etiqueta: "Nombre",
        campo: "nombre",
        requerido: true,
        valordefault: '',
        visible: true,
        disabled: false,
        ancho: 50,
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
        requerido: true,
        valordefault: '',
        visible: true,
        disabled: false,
        ancho: 1,
        formato: "N",
      },
      {
        id: "default",
        etiqueta: "Valor inicial",
        campo: "default",
        requerido: false,
        valordefault: '',
        visible: true,
        disabled: false,
        ancho: 50,
        formato: "C",
      }
    ];

  }

}
