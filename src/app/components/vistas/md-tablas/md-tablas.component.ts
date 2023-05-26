import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService, Funciones } from 'src/app/servicios/global.service';

@Component({
  selector: 'app-md-tablas',
  templateUrl: './md-tablas.component.html',
  styleUrls: ['./md-tablas.component.css']
})
export class MdTablasComponent implements OnInit {

  rutaAdd: string = '/tabla';
  listaQuery: string = "62f66176bd8xT";
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
  
