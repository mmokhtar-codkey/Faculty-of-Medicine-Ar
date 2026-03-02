import { Component, OnInit, HostListener, WritableSignal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuService } from '../../../../Services/menu.service';
import { NavbarItem } from '../../../../model/menu.model';

@Component({
  selector: 'app-medicine-menu-bar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './medicine-menu-bar.component.html',
  styleUrls: ['./medicine-menu-bar.component.css']
})
export class MedicineMenuBarComponent implements OnInit {
  activeDropdown: string | null = null;
  activeSubDropdown: string | null = null;
  activeSubSubDropdown: string | null = null;
  isCollapsed = true;
  isMobile = false;
  navbarItems: WritableSignal<NavbarItem[]> = signal([]);
  Math: any;
  Object: any;

  constructor(private menuService: MenuService) { }

  ngOnInit(): void {
    this.loadMenuItems();
    this.checkMobileView();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.checkMobileView();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.medicine-menu-bar')) {
      this.activeDropdown = null;
    }
  }

  trackByFn(index: number, item: NavbarItem): any {
    return item.id;
  }

  private loadMenuItems(): void {
    this.menuService.getAllMenus().subscribe({
      next: (items: NavbarItem[]) => this.navbarItems.set(items),
      error: () => console.log('fail to load navbar items'),
    });
  }

  private checkMobileView(): void {
    this.isMobile = window.innerWidth <= 991;
    if (!this.isMobile) {
      this.isCollapsed = true;
    }
  }

  toggleMobileMenu(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  onTabClick(tab: NavbarItem, event: Event): void {
    event.preventDefault();

    if (tab.children?.length) {
      this.activeDropdown = this.activeDropdown === tab.id ? null : tab.id;
    } else {
      this.menuService.updateActiveTab(tab.id).subscribe(updatedTabs => {
        this.navbarItems.set(updatedTabs);
      });
      this.isCollapsed = true;
      this.activeDropdown = null;
    }
  }

  onSubTabClick(subTab: NavbarItem, parentTab: NavbarItem, event: Event): void {
    event.preventDefault();

    this.menuService.updateActiveTab(subTab.id).subscribe(updatedTabs => {
      this.navbarItems.set(updatedTabs);
    });

    this.isCollapsed = true;
    this.activeDropdown = null;
  }


  onSubSubTabClick(subChild: any, child: any, parent: any, event: Event) {
    event.preventDefault(); // هنا ممكن تعمل أي منطق إضافي زي التنقل أو حفظ الحالة 
    this.activeSubSubDropdown = this.activeSubSubDropdown === subChild.id ? null : subChild.id;
  }

    splitChildren(children: NavbarItem[] | undefined): [NavbarItem[], NavbarItem[]] {
      if (!children || children.length === 0) {
        return [[], []];
      }
      const mid = Math.ceil(children.length / 2);
      return [children.slice(0, mid), children.slice(mid)];
    }

    groupChildrenByType(children: NavbarItem[] | undefined): Record < string, NavbarItem[] > {
      if(!children) return {};
      return children.reduce((acc, child) => {
        const type = child.departmentType || 'Other';
        if (!acc[type]) {
          acc[type] = [];
        }
        acc[type].push(child);
        return acc;
      }, {} as Record<string, NavbarItem[]>);
    }
    getRouterLink(item: any): string | null {
      if (item.children?.length > 0) {
        return null; // أو item.slug + '/' + item.children[0].slug حسب المطلوب
      }
      return item.slug;
    }


  }
