export interface Footer {
  id: string;
  quickLinks: QuickLink[];
  socialLinks: SocialLink[];
  copyright: string;
  description: string;
}

export interface QuickLink {
  id: string;
  text: string;
  url: string;
  icon?: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
}