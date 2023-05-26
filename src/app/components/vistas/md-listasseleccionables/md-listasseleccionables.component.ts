import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService, Funciones } from 'src/app/servicios/global.service';

@Component({
  selector: 'app-md-listasseleccionables',
  templateUrl: './md-listasseleccionables.component.html',
  styleUrls: ['./md-listasseleccionables.component.css']
})
export class MdListasseleccionablesComponent implements OnInit {

  rutaAdd: string = '/listaseleccionable';
  listaQuery: string = "62f66176bd8xI";
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