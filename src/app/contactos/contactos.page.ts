import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { CallNumber } from '@ionic-native/call-number/ngx';
@Component({
  selector: 'app-contactos',
  templateUrl: './contactos.page.html',
  styleUrls: ['./contactos.page.scss'],
})
export class ContactosPage implements OnInit {

  constructor(private router: Router,private callNumber: CallNumber) { }

  llamada(){
    this.callNumber.callNumber("669136133", true)
    .then(res => console.log('Llamando!', res))
    .catch(err => console.log('Problemas', err));
  }
  abrircontactos(){
    this.router.navigate(["/contactos/"]);

  }

  abririnfo(){
    this.router.navigate(["/info/"]);
  }

  abrirhome(){
    this.router.navigate(["/home/"]);
  }
  ngOnInit() {
  }

}
