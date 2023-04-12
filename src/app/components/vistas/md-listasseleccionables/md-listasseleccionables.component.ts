import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService, Funciones } from 'src/app/servicios/global.service';

@Component({
  selector: 'app-md-listasseleccionables',
  templateUrl: './md-listasseleccionables.component.html',
  styleUrls: ['./md-listasseleccionables.component.css']
})
export class MdListasseleccionablesComponent implements OnInit {

  tipo: string = 'I';
  rutaAdd: string = '';

  constructor(
    private global: GlobalService,    
    private funciones: Funciones,
    private route: ActivatedRoute,
  ) {

    this.rutaAdd = '/listaseleccionable';

  }
  ngOnInit(): void {}

}