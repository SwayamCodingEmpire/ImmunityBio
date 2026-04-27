import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

interface SidebarMenuItem {
  label: string;
  icon?: string;
  route?: string;
  queryParams?: Record<string, string>;
  children?: SidebarMenuItem[];
  section?: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  private readonly router = inject(Router);

  protected expandedMenu: string | null = null;

  protected readonly menuItems: SidebarMenuItem[] = [
    { label: 'Dashboard', icon: 'bi bi-grid', route: '/dashboard' },
    {
      label: 'Sales Management',
      icon: 'bi bi-bar-chart-steps',
      children: [
        { label: 'Daily Sales', route: '/sales-registry', queryParams: { tab: 'daily-sales' } },
        { label: 'Sales Report', route: '/sales-registry', queryParams: { tab: 'sales-report' } },
        { label: 'Sales Performance', route: '/sales-registry', queryParams: { tab: 'performance' } }
      ]
    },
    {
      label: 'Order Management',
      icon: 'bi bi-cart3',
      children: [
        { label: 'Add/View/Edit Order', route: '/order-management', queryParams: { tab: 'view-orders' } },
        { label: 'Order Tracking', route: '/order-management', queryParams: { tab: 'tracking' } }
      ]
    },
    // { label: 'Network', section: 'Network' },
    { label: 'Patient Management', icon: 'bi bi-person-hearts', route: '/patient-enrollment' },
    { label: 'Physician Management', icon: 'bi bi-hospital', route: '/provider-network' },
    {
      label: 'Territory Management',
      icon: 'bi bi-map',
      children: [
        { label: 'Territories', route: '/territory-manager', queryParams: { tab: 'territories' } },
        { label: 'Sales Rep Assignment', route: '/territory-manager', queryParams: { tab: 'assignment' } },
        { label: 'Territory Performance', route: '/territory-manager', queryParams: { tab: 'performance' } }
      ]
    },
    {
      label: 'Sales Team',
      icon: 'bi bi-people',
      children: [
        { label: 'Representative Profiles', route: '/sales-team', queryParams: { tab: 'profiles' } },
        { label: 'Targets & Achievements', route: '/sales-team', queryParams: { tab: 'targets' } }
      ]
    }
  ];

  protected toggleMenu(label: string): void {
    this.expandedMenu = this.expandedMenu === label ? null : label;
  }

  protected isLinkActive(item: SidebarMenuItem): boolean {
    if (!item.route) {
      return false;
    }

    const currentPath = this.router.url.split('?')[0];
    return currentPath === item.route || currentPath.startsWith(item.route + '/');
  }

  protected isChildActive(item: SidebarMenuItem): boolean {
    if (!item.route) {
      return false;
    }

    const urlTree = this.router.parseUrl(this.router.url);
    const currentPath = urlTree.root.children['primary']?.segments.map((segment) => segment.path).join('/') ?? '';
    const normalizedPath = `/${currentPath}`;

    if (normalizedPath !== item.route) {
      return false;
    }

    if (!item.queryParams) {
      return true;
    }

    return Object.entries(item.queryParams).every(([key, value]) => urlTree.queryParams[key] === value);
  }

  protected isMenuActive(item: SidebarMenuItem): boolean {
    return item.children?.some((child) => this.isChildActive(child)) ?? false;
  }
}
