type BookEditor = {
  name: string;
  birth_year: number;
  death_year: number;
}

export interface BookModel {
  title: string;
  id: number,
  authors: BookEditor[],
  summaries: string [],
  editors: BookEditor[],
  translators: BookEditor[],
  subjects: string [],
  bookshelves: string [],
  languages: string [],
  copyright: boolean,
  media_type: string,
  formats: { [key: string]: string },
  download_count: number;
}

export interface BookResponseModel {
  count: number;
  next: string | null;
  previous: string | null;
  results: BookModel[] | null;
}

export interface SavedBooksResponseModel {
  data: BookModel[];
  message: string;
  success: boolean;
}

export interface BulkInsertBooksResponseModel {
  data: {
    insertedIds: number[];
    ignoredIds: number[];
  };
  message: string;
  success: boolean;
}

export interface BulkDeleteBooksResponseModel {
  data: {
    deletedIds: number[];
    notFoundOrIgnored: number[];
  };
  message: string;
  success: boolean;
}
