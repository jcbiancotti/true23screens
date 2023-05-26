import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService, Funciones } from 'src/app/servicios/global.service';

@Component({
  selector: 'app-scr-crud1s',
  templateUrl: './scr-crud1s.component.html',
  styleUrls: ['./scr-crud1s.component.css']
})
export class ScrCrud1sComponent implements OnInit {

  rutaAdd: string = "/edicionregistro";
  listaQuery: string = "643d6c7c1b6c9";
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
