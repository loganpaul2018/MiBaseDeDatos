import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-contactos',
  templateUrl: './contactos.page.html',
  styleUrls: ['./contactos.page.scss'],
})
export class ContactosPage implements OnInit {

  constructor(private router: Router) { }

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
