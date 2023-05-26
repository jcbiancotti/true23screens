import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService, Funciones } from 'src/app/servicios/global.service';

@Component({
  selector: 'app-md-consultassql',
  templateUrl: './md-consultassql.component.html',
  styleUrls: ['./md-consultassql.component.css']
})
export class MdConsultassqlComponent implements OnInit {

  rutaAdd: string = '/consultasql';
  listaQuery: string = "62f66176bd8xQ";
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
