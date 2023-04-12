import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService, Funciones } from 'src/app/servicios/global.service';

@Component({
  selector: 'app-md-consultassql',
  templateUrl: './md-consultassql.component.html',
  styleUrls: ['./md-consultassql.component.css']
})
export class MdConsultassqlComponent implements OnInit {

  tipo: string = 'Q';
  rutaAdd: string = '';

  constructor(
    private global: GlobalService,    
    private funciones: Funciones,
    private route: ActivatedRoute,
  ) {

    this.rutaAdd = '/consultasql';

  }
  ngOnInit(): void {}

}
