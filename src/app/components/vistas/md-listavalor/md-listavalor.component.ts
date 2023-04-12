import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from 'src/app/servicios/global.service';

@Component({
  selector: 'app-md-listavalor',
  templateUrl: './md-listavalor.component.html',
  styleUrls: ['./md-listavalor.component.css']
})
export class MdListavalorComponent implements OnInit {

  id: string | null = '';
  rutaCrud2: string = "/listavalorvalor";
  rutaRetorno: string = "/in/listasdevalores";
  
    constructor ( 
      private global: GlobalService,
      private route: ActivatedRoute,
    ) {
      this.id = route.snapshot.params['id'];
  
      if(this.global.DEBUG)
        console.log("Datos recibidos ID:", this.id);
  
    }
  
    ngOnInit(): void {} 
  
  }
