import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService, Funciones } from 'src/app/servicios/global.service';

@Component({
  selector: 'app-md-tablas',
  templateUrl: './md-tablas.component.html',
  styleUrls: ['./md-tablas.component.css']
})
export class MdTablasComponent implements OnInit {

  tipo: string = 'T';
  rutaAdd: string = '';

  constructor(
    private global: GlobalService,    
    private funciones: Funciones,
    private route: ActivatedRoute,
  ) {

    this.rutaAdd = '/tabla';

  }
  ngOnInit(): void {}

}
  
