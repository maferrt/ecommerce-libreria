export type ApiUserRole = "USER" | "ADMIN";

export type ApiAuthUser = {
  id: number;
  name: string;
  email: string;
  role: ApiUserRole;
};

export type ApiAuthResponse = {
  token: string;
  user: ApiAuthUser;
};

export type ApiRegisterRequest = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type ApiLoginRequest = {
  email: string;
  password: string;
};

export type ApiAddress = {
  id?: number;
  street: string;
  exteriorNumber: string;
  interiorNumber: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  references: string;
};

export type ApiProfile = {
  id: number;
  userId: number;
  email: string;
  displayName: string;
  avatar: string | null;
  currentReading: string;
  readerStatus: string;
  bio: string;
  favoriteGenre: string;
  address: ApiAddress;
};

export type ApiProfileUpdateRequest = {
  displayName: string;
  avatar: string | null;
  currentReading: string;
  readerStatus: string;
  bio: string;
  favoriteGenre: string;
  address: {
    street: string;
    exteriorNumber: string;
    interiorNumber: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    references: string;
  };
};