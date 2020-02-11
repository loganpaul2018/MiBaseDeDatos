import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})
export class InfoPage implements OnInit {

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
