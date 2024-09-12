import { Component } from '@angular/core';

@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.css'
})
export class SideMenuComponent {
  selected_button:number = 1;  

  onMenuButtonClicked(index:number){
    this.selected_button = index;
  }
}
