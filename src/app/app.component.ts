import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { TopNavComponent } from './layout/top-nav/top-nav.component';
import { filter } from 'rxjs/operators';
// import { FooterComponent } from './layout/footer/footer.component';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidebarComponent, TopNavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Anktiva Portal';
  protected isSidebarCollapsed = false;
  protected isLoginPage = false;

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((e: NavigationEnd) => {
      this.isLoginPage = e.urlAfterRedirects === '/login';
    });
  }

  protected toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
    this.emitLayoutResize();
  }

  protected expandSidebar(): void {
    this.isSidebarCollapsed = false;
    this.emitLayoutResize();
  }

  private emitLayoutResize(): void {
    setTimeout(() => window.dispatchEvent(new Event('resize')), 220);
  }
}
