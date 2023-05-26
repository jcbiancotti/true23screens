import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-orq-roles',
  templateUrl: './orq-roles.component.html',
  styleUrls: ['./orq-roles.component.css']
})
export class OrqRolesComponent implements OnInit {

  rutaAdd: string = "/rol";
  listaQuery: string = "64639bded32b6"
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
    },
    {
      titulo: "Es administrador",
      ordenar: true,
      campo: "es_admin"
    }
  ];
  
  constructor() { }

  ngOnInit(): void { }

}
