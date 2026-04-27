import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  expandedMenus: { [key: string]: boolean } = {};

  toggleMenu(menu: string, event: Event) {
    event.preventDefault();
    this.expandedMenus[menu] = !this.expandedMenus[menu];
  }
}
