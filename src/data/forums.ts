import type { ForumCategory } from "@/types/forum";

export const POINTS_BY_POST = 10;
export const POINTS_BY_REPLY = 5;

export const forumCategories: ForumCategory[] = [
  {
    id: "novela-juvenil",
    nombre: "Novela Juvenil",
    descripcion:
      "Comparte historias, sagas y personajes que conectan con lectores jóvenes.",
    icono: "📚",
  },
  {
    id: "fantasia",
    nombre: "Fantasía",
    descripcion:
      "Comparte recomendaciones y opiniones sobre mundos mágicos, héroes y criaturas.",
    icono: "🐉",
  },
  {
    id: "terror",
    nombre: "Terror",
    descripcion:
      "Comparte historias escalofriantes y libros que te quitaron el sueño.",
    icono: "👻",
  },
  {
    id: "desarrollo-personal",
    nombre: "Desarrollo personal",
    descripcion:
      "Conversa sobre libros que inspiran hábitos, crecimiento y bienestar.",
    icono: "🌱",
  },
  {
    id: "ciencia-ficcion",
    nombre: "Ciencia Ficción",
    descripcion:
      "Explora futuros posibles, tecnología, viajes espaciales y mundos alternativos.",
    icono: "🚀",
  },
  {
    id: "educacion-financiera",
    nombre: "Educación financiera",
    descripcion:
      "Comparte lecturas sobre dinero, ahorro, inversión y hábitos financieros.",
    icono: "💰",
  },
  {
    id: "psicologia",
    nombre: "Psicología",
    descripcion:
      "Habla sobre libros relacionados con mente, emociones, conducta y autoconocimiento.",
    icono: "🧠",
  },
];