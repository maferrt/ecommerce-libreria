export type BookCategory =
  | "novela-juvenil"
  | "fantasia"
  | "terror"
  | "desarrollo-personal"
  | "ciencia-ficcion"
  | "educacion-financiera"
  | "psicologia";

export type Book = {
  id: number;
  titulo: string;
  autor: string;
  categoria: BookCategory;
  saga: string | null;
  editorial: string;
  edicion: string;
  isbn: string;
  precio: number;
  portada: string;
  sinopsis: string;
};

export type Saga = {
  id: string;
  nombre: string;
  isbnSaga: string;
  precioSaga: number;
  portada: string;
  descripcion: string;
  libros: number[];
};

export type CatalogData = {
  libros: Book[];
  sagas: Saga[];
};