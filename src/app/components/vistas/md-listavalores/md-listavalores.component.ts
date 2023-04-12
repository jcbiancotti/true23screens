import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService, Funciones } from 'src/app/servicios/global.service';

@Component({
  selector: 'app-md-listavalores',
  templateUrl: './md-listavalores.component.html',
  styleUrls: ['./md-listavalores.component.css']
})
export class MdListavaloresComponent implements OnInit {

  tipo: string = 'L';
  rutaAdd: string = '';

  constructor(
    private global: GlobalService,    
    private funciones: Funciones,
    private route: ActivatedRoute,
  ) {

    this.rutaAdd = '/listadevalor';

  }
  ngOnInit(): void {}

}
