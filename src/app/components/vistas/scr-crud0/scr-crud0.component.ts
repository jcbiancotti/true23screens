import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService, Funciones } from 'src/app/servicios/global.service';

@Component({
  selector: 'app-scr-crud0',
  templateUrl: './scr-crud0.component.html',
  styleUrls: ['./scr-crud0.component.css']
})
export class ScrCrud0Component implements OnInit {

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