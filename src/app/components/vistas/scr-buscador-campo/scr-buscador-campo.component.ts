import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService, Funciones } from 'src/app/servicios/global.service';

@Component({
  selector: 'app-scr-buscador-campo',
  templateUrl: './scr-buscador-campo.component.html',
  styleUrls: ['./scr-buscador-campo.component.css']
})
export class ScrBuscadorCampoComponent implements OnInit {

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

    this.rutaRetorno = "/in/buscador/";
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
        id: "campo",
        etiqueta: "Campo",
        campo: "campo",
        requerido: true,
        valordefault: '',
        visible: true,
        disabled: false,
        ancho: 50,
        formato: "C",
      }
      
    ];

  }
}
