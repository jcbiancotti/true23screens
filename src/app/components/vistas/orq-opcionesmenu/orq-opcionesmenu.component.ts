import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-orq-opcionesmenu',
  templateUrl: './orq-opcionesmenu.component.html',
  styleUrls: ['./orq-opcionesmenu.component.css']
})
export class OrqOpcionesmenuComponent implements OnInit {

  rutaAdd: string = "/opcionmenu";
  listaQuery:string = "6463a5631a8a0";  // ID de la consulta SQL de Opciones del menu
      
  constructor() { }
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
      titulo: "Opción padre",
      ordenar: true,
      campo: "opcpadre"
    },
    {
      titulo: "Pantalla",
      ordenar: true,
      campo: "opcscreen"
    }
  ];
  
  ngOnInit(): void {
  }

}
