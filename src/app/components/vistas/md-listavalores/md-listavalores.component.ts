import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService, Funciones } from 'src/app/servicios/global.service';

@Component({
  selector: 'app-md-listavalores',
  templateUrl: './md-listavalores.component.html',
  styleUrls: ['./md-listavalores.component.css']
})
export class MdListavaloresComponent implements OnInit {

  rutaAdd: string = '/listadevalor';
  listaQuery: string = "62f66176bd8xL";
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
  constructor() {}
  
  ngOnInit(): void {}

}
