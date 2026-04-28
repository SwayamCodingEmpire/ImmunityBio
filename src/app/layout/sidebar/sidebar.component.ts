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
      label: 'Sales',
      icon: 'bi bi-bar-chart-steps',
      children: [
        { label: 'Daily Sales', route: '/sales-registry', queryParams: { tab: 'daily-sales' } },
        { label: 'Sales Report', route: '/sales-registry', queryParams: { tab: 'sales-report' } },
        { label: 'Sales Performance', route: '/sales-registry', queryParams: { tab: 'performance' } }
      ]
    },
    {
      label: 'Orders',
      icon: 'bi bi-cart3',
      children: [
        { label: 'Order Directory', route: '/order-management', queryParams: { tab: 'directory' } },
        // { label: 'Create Order', route: '/order-management', queryParams: { tab: 'create-order' } },
        { label: 'Order Tracking', route: '/order-management', queryParams: { tab: 'tracking' } }
      ]
    },
    // { label: 'Network', section: 'Network' },
    {
      label: 'Patients',
      icon: 'bi bi-person-hearts',
      children: [
        { label: 'Patient Directory', route: '/patient-enrollment', queryParams: { tab: 'directory' } },
        // { label: 'Add Patient', route: '/patient-enrollment', queryParams: { tab: 'add-patient' } },
        // { label: 'Patient Profile', route: '/patient-enrollment', queryParams: { tab: 'profile' } },
        { label: 'Enrollment Management', route: '/patient-enrollment', queryParams: { tab: 'enrollment' } },
        // { label: 'Patient Timeline', route: '/patient-enrollment', queryParams: { tab: 'timeline' } }
      ]
    },
    {
      label: 'Physicians',
      icon: 'bi bi-hospital',
      children: [
        { label: 'Physician Directory', route: '/provider-network', queryParams: { tab: 'directory' } },
        // { label: 'Add Physician', route: '/provider-network', queryParams: { tab: 'add-physician' } },
        // { label: 'Physician Profile', route: '/provider-network', queryParams: { tab: 'profile' } },
        // { label: 'Physician Orders', route: '/provider-network', queryParams: { tab: 'orders' } },
        { label: 'Territory Mapping', route: '/provider-network', queryParams: { tab: 'territory-mapping' } },
        // { label: 'Physician Timeline', route: '/provider-network', queryParams: { tab: 'timeline' } }
      ]
    },
    {
      label: 'Territories',
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
        { label: 'Representatives', route: '/sales-team', queryParams: { tab: 'representatives' } },
        { label: 'Targets & Performance', route: '/sales-team', queryParams: { tab: 'performance' } },
        { label: 'Activities', route: '/sales-team', queryParams: { tab: 'activities' } }
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
