export type RegisteredUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
};

export type AccountSession = {
  userId: string;
  email: string;
};

export type ReaderStatus =
  | "Leyendo ahora"
  | "Buscando nueva lectura"
  | "En pausa lectora"
  | "Fan de sagas"
  | "Modo terror activado"
  | "Releyendo favoritos";

export type UserProfile = {
  userId: string;
  displayName: string;
  avatar: string | null;
  currentReading: string;
  readerStatus: ReaderStatus;
  bio: string;
  favoriteGenre: string;
};

export type AccountRegisterInput = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type AccountLoginInput = {
  email: string;
  password: string;
};