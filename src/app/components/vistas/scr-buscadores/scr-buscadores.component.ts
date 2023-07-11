import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-scr-buscadores',
  templateUrl: './scr-buscadores.component.html',
  styleUrls: ['./scr-buscadores.component.css']
})
export class ScrBuscadoresComponent implements OnInit {

  rutaAdd: string = '/buscador';
  listaQuery: string = "64a7f66174140";
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
