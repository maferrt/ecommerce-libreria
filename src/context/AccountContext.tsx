"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import type {
  AccountLoginInput,
  AccountRegisterInput,
  ReaderStatus,
  RegisteredUser,
  UserAddress,
  UserProfile,
} from "@/types/account";
import {
  clearAuthSession,
  getAuthToken,
  getStoredAuthUser,
  saveAuthSession,
} from "@/lib/auth-storage";
import { getCurrentUserRequest, loginRequest, registerRequest } from "@/lib/auth-api";
import { getProfileRequest, updateProfileRequest } from "@/lib/profile-api";
import { getForumsRequest } from "@/lib/forum-api";
import type { ApiAuthUser, ApiProfile, ApiProfileUpdateRequest } from "@/lib/api-types";

type AccountActionResult = {
  ok: boolean;
  message: string;
};

type AccountContextValue = {
  users: RegisteredUser[];
  currentUser: RegisteredUser | null;
  currentProfile: UserProfile | null;
  isAuthenticated: boolean;
  isLoadingAccount: boolean;
  totalForumPoints: number;
  registerUser: (input: AccountRegisterInput) => Promise<AccountActionResult>;
  loginUser: (input: AccountLoginInput) => Promise<AccountActionResult>;
  logoutUser: () => void;
  updateProfile: (profile: UserProfile) => Promise<AccountActionResult>;
  refreshAccountData: () => void;
};

const AccountContext = createContext<AccountContextValue | null>(null);

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function toRegisteredUser(user: ApiAuthUser): RegisteredUser {
  return {
    id: String(user.id),
    name: user.name,
    email: user.email,
    password: "",
    createdAt: new Date().toISOString(),
  };
}

function normalizeReaderStatus(value: string): ReaderStatus {
  const validStatuses: ReaderStatus[] = [
    "Leyendo ahora",
    "Buscando nueva lectura",
    "En pausa lectora",
    "Fan de sagas",
    "Modo terror activado",
    "Releyendo favoritos",
  ];

  if (validStatuses.includes(value as ReaderStatus)) {
    return value as ReaderStatus;
  }

  return "Buscando nueva lectura";
}

function toUserAddress(address: ApiProfile["address"]): UserAddress {
  return {
    street: address?.street ?? "",
    exteriorNumber: address?.exteriorNumber ?? "",
    interiorNumber: address?.interiorNumber ?? "",
    neighborhood: address?.neighborhood ?? "",
    city: address?.city ?? "",
    state: address?.state ?? "",
    zipCode: address?.zipCode ?? "",
    country: address?.country ?? "México",
    references: address?.references ?? "",
  };
}

function toUserProfile(profile: ApiProfile): UserProfile {
  return {
    userId: String(profile.userId),
    displayName: profile.displayName,
    avatar: profile.avatar,
    currentReading: profile.currentReading ?? "",
    readerStatus: normalizeReaderStatus(profile.readerStatus),
    bio: profile.bio ?? "",
    favoriteGenre: profile.favoriteGenre ?? "Novela Juvenil",
    address: toUserAddress(profile.address),
  };
}

function toApiProfileUpdateRequest(profile: UserProfile): ApiProfileUpdateRequest {
  return {
    displayName: profile.displayName,
    avatar: profile.avatar,
    currentReading: profile.currentReading,
    readerStatus: profile.readerStatus,
    bio: profile.bio,
    favoriteGenre: profile.favoriteGenre,
    address: {
      street: profile.address.street,
      exteriorNumber: profile.address.exteriorNumber,
      interiorNumber: profile.address.interiorNumber,
      neighborhood: profile.address.neighborhood,
      city: profile.address.city,
      state: profile.address.state,
      zipCode: profile.address.zipCode,
      country: profile.address.country,
      references: profile.address.references,
    },
  };
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "No se pudo conectar con el servidor.";
}

async function getTotalForumPointsRequest() {
  try {
    const forums = await getForumsRequest();

    return forums.reduce((total, forum) => {
      return total + Number(forum.points ?? 0);
    }, 0);
  } catch {
    return 0;
  }
}

export function AccountProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<RegisteredUser[]>([]);
  const [currentUser, setCurrentUser] = useState<RegisteredUser | null>(null);
  const [currentProfile, setCurrentProfile] = useState<UserProfile | null>(null);
  const [isLoadingAccount, setIsLoadingAccount] = useState(true);
  const [accountRefreshKey, setAccountRefreshKey] = useState(0);
  const [totalForumPoints, setTotalForumPoints] = useState(0);

  useEffect(() => {
    async function hydrateSession() {
      const token = getAuthToken();
      const storedUser = getStoredAuthUser();

      if (!token || !storedUser) {
        setIsLoadingAccount(false);
        return;
      }

      try {
        const apiUser = await getCurrentUserRequest();
        const apiProfile = await getProfileRequest();
        const forumPoints = await getTotalForumPointsRequest();

        const nextUser = toRegisteredUser(apiUser);
        const nextProfile = toUserProfile(apiProfile);

        setCurrentUser(nextUser);
        setUsers([nextUser]);
        setCurrentProfile(nextProfile);
        setTotalForumPoints(forumPoints);
      } catch {
        clearAuthSession();
        setCurrentUser(null);
        setCurrentProfile(null);
        setUsers([]);
        setTotalForumPoints(0);
      } finally {
        setIsLoadingAccount(false);
      }
    }

    void hydrateSession();
  }, [accountRefreshKey]);

  async function loadProfile() {
    const apiProfile = await getProfileRequest();
    const nextProfile = toUserProfile(apiProfile);

    setCurrentProfile(nextProfile);

    return nextProfile;
  }

  async function registerUser(
    input: AccountRegisterInput,
  ): Promise<AccountActionResult> {
    const cleanName = input.name.trim();
    const cleanEmail = normalizeEmail(input.email);
    const cleanPassword = input.password.trim();
    const cleanConfirmPassword = input.confirmPassword.trim();

    if (!cleanName || !cleanEmail || !cleanPassword || !cleanConfirmPassword) {
      return {
        ok: false,
        message: "Completa todos los campos para crear tu cuenta.",
      };
    }

    if (cleanPassword !== cleanConfirmPassword) {
      return {
        ok: false,
        message: "Las contraseñas no coinciden.",
      };
    }

    try {
      const response = await registerRequest({
        name: cleanName,
        email: cleanEmail,
        password: cleanPassword,
        confirmPassword: cleanConfirmPassword,
      });

      saveAuthSession(response.token, response.user);

      const nextUser = toRegisteredUser(response.user);

      setCurrentUser(nextUser);
      setUsers([nextUser]);

      await loadProfile();
      setTotalForumPoints(0);

      return {
        ok: true,
        message: "Cuenta creada correctamente.",
      };
    } catch (error) {
      return {
        ok: false,
        message: getErrorMessage(error),
      };
    }
  }

  async function loginUser(input: AccountLoginInput): Promise<AccountActionResult> {
    const cleanEmail = normalizeEmail(input.email);
    const cleanPassword = input.password.trim();

    if (!cleanEmail || !cleanPassword) {
      return {
        ok: false,
        message: "Escribe tu correo y contraseña.",
      };
    }

    try {
      const response = await loginRequest({
        email: cleanEmail,
        password: cleanPassword,
      });

      saveAuthSession(response.token, response.user);

      const nextUser = toRegisteredUser(response.user);

      setCurrentUser(nextUser);
      setUsers([nextUser]);

      await loadProfile();

      const forumPoints = await getTotalForumPointsRequest();
      setTotalForumPoints(forumPoints);

      return {
        ok: true,
        message: "Sesión iniciada correctamente.",
      };
    } catch (error) {
      return {
        ok: false,
        message: getErrorMessage(error),
      };
    }
  }

  function logoutUser() {
    clearAuthSession();
    setCurrentUser(null);
    setCurrentProfile(null);
    setUsers([]);
    setTotalForumPoints(0);
  }

  async function updateProfile(
    profile: UserProfile,
  ): Promise<AccountActionResult> {
    try {
      const apiProfile = await updateProfileRequest(
        toApiProfileUpdateRequest(profile),
      );

      setCurrentProfile(toUserProfile(apiProfile));

      return {
        ok: true,
        message: "Tus datos de perfil se guardaron correctamente.",
      };
    } catch (error) {
      return {
        ok: false,
        message: getErrorMessage(error),
      };
    }
  }

  function refreshAccountData() {
    setAccountRefreshKey((currentValue) => currentValue + 1);
  }

  const value: AccountContextValue = {
    users,
    currentUser,
    currentProfile,
    isAuthenticated: Boolean(currentUser),
    isLoadingAccount,
    totalForumPoints,
    registerUser,
    loginUser,
    logoutUser,
    updateProfile,
    refreshAccountData,
  };

  return (
    <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
  );
}

export function useAccount() {
  const context = useContext(AccountContext);

  if (!context) {
    throw new Error("useAccount debe usarse dentro de AccountProvider.");
  }

  return context;
}