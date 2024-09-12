import { Component } from '@angular/core';
import { ClientsComponent } from "./clients/clients.component";

@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [ClientsComponent],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.css'
})
export class MainContentComponent {

}
