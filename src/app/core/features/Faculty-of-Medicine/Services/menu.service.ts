import { Injectable, inject } from '@angular/core';
import { NavbarItem, ApiMenuItem } from '../model/menu.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { slugify } from '../../../../utils/slugify';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import {
  catchError,
  of,

} from 'rxjs';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  [x: string]: any;
  private apiUrl = environment.apiUrl;
  private readonly errorHandler = inject(ErrorHandlerService);

  constructor(
    private http: HttpClient
  ) { }


  // new method to get menu items from API
  getAllMenus(): Observable<NavbarItem[]> {
    return this.http.get<{ data: ApiMenuItem[] }>(`${this.apiUrl}menus/getall`).pipe(
      map((response) => this.buildTree(response.data)),
      catchError((error) => {
        this.errorHandler.handleError(error);
        return of([]); 
      }),
    );
  }


  private buildTree(items: ApiMenuItem[]): NavbarItem[] {
    // نجيب العناصر الرئيسية بس
    const roots = items.filter((i) => !i.parentId);

    return roots
      .sort((a, b) => a.order - b.order)
      .map((item) => this.mapItem(item));
  }

  private mapItem(item: ApiMenuItem): NavbarItem {
    return {
      id: item.id,
      type: item.titleEn?.toLowerCase() === 'departments' ? 'columns' : 'menu',
      departmentType : item.departmentType,
      isActive: false,
      pageId: item.pageId,
      label: item.title,
      icon: item.icon,
      slug: item.titleEn ? `/${slugify(item.titleEn)}` : '/',
      children: item.childs?.length
        ? item.childs.sort((a, b) => a.order - b.order)
          .map((child) => this.mapItem(child)) : undefined,
    };
  }

  updateActiveTab(id: string): Observable<NavbarItem[]> {
    return this.getAllMenus().pipe(
      map((tabs) => {
        this.deactivateAll(tabs);
        this.findAndActivate(tabs, id);
        return tabs;
      })
    );
  }

  private deactivateAll(tabs: NavbarItem[]): void {
    tabs.forEach(tab => {
      tab.isActive = false;
      if (tab.children) {
        this.deactivateAll(tab.children);
      }
    });
  }

  private findAndActivate(tabs: NavbarItem[], id: string, parent?: NavbarItem): boolean {
    for (let tab of tabs) {
      if (tab.id === id) {
        tab.isActive = true;
        if (parent) {
          parent.isActive = true;
        }
        return true;
      }
      if (tab.children && this.findAndActivate(tab.children, id, tab)) {
        return true;
      }
    }
    return false;
  }
}
