import { Component } from '@angular/core';
import { MainContentComponent } from './main/main-content.component';
import { NavComponent } from "./nav/nav.component";
import { SideMenuComponent } from "./side-menu/side-menu.component";

@Component({
  selector: 'app-app-content',
  standalone: true,
  imports: [MainContentComponent, NavComponent, SideMenuComponent],
  templateUrl: './app-content.component.html',
  styleUrl: './app-content.component.css'
})
export class AppContentComponent {

}
