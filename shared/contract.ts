export interface Book {
    title: string;
    authors: Author[];
    description: any;
    cover: any;
    slug: string;
    publisher: Publisher;
}

export interface Publisher {
    name: string;
    pageContent: any;
    slug: string;
}

export interface Author {
    name: string;
    slug: string;
}