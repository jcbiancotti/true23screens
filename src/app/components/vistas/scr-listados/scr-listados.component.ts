import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService, Funciones } from 'src/app/servicios/global.service';

@Component({
  selector: 'app-scr-listados',
  templateUrl: './scr-listados.component.html',
  styleUrls: ['./scr-listados.component.css']
})
export class ScrListadosComponent implements OnInit {

  rutaAdd: string = "/listado";
  listaQuery: string = "643e5324017a6";
  campos: any[] = [
    {
      titulo: "ID",
      ordenar: true,
      campo: "id"
    },
    {
      titulo: "Descripcion",
      ordenar: true,
      campo: "descripcion"
    }
  ];
  
  constructor() { }
  
  ngOnInit(): void {}

}
