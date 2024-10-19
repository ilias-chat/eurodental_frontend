import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.css'
})
export class SideMenuComponent {
  selected_button:number = 1;  
  is_menu_closed:boolean = false;

  onMenuButtonClicked(index:number){
    this.selected_button = index;
  }

  on_btn_menu_cliked(event:Event){
    this.is_menu_closed=!this.is_menu_closed;
    const target= event.target as HTMLElement;
    target.classList.toggle('rotate');
  }
}
