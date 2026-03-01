import { DepartmentType } from "../../../enums/app.enums";

export interface MenuTab {
  id: number;
  title: string;
  icon?: string;
  target?: string;
  fragment?: string;
  isActive: boolean;
  type?: 'menu' | 'columns';
  childs?: MenuTab[];
}
export interface NavbarItem {
  id: string;  
  pageId: string;
  label: string;
  slug: string;
  isActive: boolean;
    type: 'menu' | 'columns';
       departmentType: DepartmentType;
  icon?: string;
  children?: NavbarItem[];
}

export interface ApiMenuItem {
  id: string;
  pageId: string;
  title: string;
  titleEn: string;
  icon: string;
  order: number;
     departmentType: DepartmentType;
  parentId: string | null;
  childs: ApiMenuItem[];
}