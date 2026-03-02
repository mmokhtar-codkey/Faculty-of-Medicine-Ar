// تصنيفات الخبر
export interface PostCategory {
  id: string;
  postId: string;
  categoryId: string;
  categoryName: string;
}

// مرفقات الخبر (صور / ملفات)
export interface PostAttachment {
  id: string;
  fileName: string;
  isPublic: boolean;
  relativePath: string;
  folderName: string;
  url: string;
  postId: string;
}

// الموديل الأساسي للخبر
export interface News {
  id: string;
  title: string;
  urlTitleEn: string;
  content: string;
  status: string;
  publishedDate: string | null;
  featuredImagePath: string;
  pageId: string;
  pageTittle: string;
  createdDate: string;
  postCategories: PostCategory[];
  postAttachments: PostAttachment[];
  tags: string[];
}
