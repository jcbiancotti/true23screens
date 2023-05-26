import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService, Funciones } from 'src/app/servicios/global.service';

@Component({
  selector: 'app-scr-crud0s',
  templateUrl: './scr-crud0s.component.html',
  styleUrls: ['./scr-crud0s.component.css']
})
export class ScrCrud0sComponent implements OnInit {
  
  rutaAdd: string = '/tabladegestion';
  listaQuery: string = "643d689e0d7dd";
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