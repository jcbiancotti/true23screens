import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-true-message-box',
  templateUrl: './true-message-box.component.html',
  styleUrls: ['./true-message-box.component.css']
})
export class TrueMessageBoxComponent implements OnInit {

  titulo: string = "";
  mensaje: string = "";
  categoria: string = ""
  btnOk: string = "";
  btnCancel: string = "";

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
    titulo: string, 
    mensaje: string,
    categoria: string,
    btnOk: string,
    btnCancel: string
  }) { 

      this.titulo = data.titulo;
      this.mensaje = data.mensaje;
      this.categoria = data.categoria;
      this.btnOk = data.btnOk;
      this.btnCancel = data.btnCancel;

    }

  ngOnInit(): void {
  }

}
