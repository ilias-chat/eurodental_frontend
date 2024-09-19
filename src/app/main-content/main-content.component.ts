import { Component } from '@angular/core';
import { ClientsComponent } from "./clients/clients.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [ClientsComponent, RouterOutlet],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.css'
})
export class MainContentComponent {

}
