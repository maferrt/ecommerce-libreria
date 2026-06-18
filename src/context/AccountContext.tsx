"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type {
  AccountLoginInput,
  AccountRegisterInput,
  AccountSession,
  RegisteredUser,
  UserProfile,
} from "@/types/account";

const USERS_STORAGE_KEY = "mel_registered_users";
const SESSION_STORAGE_KEY = "mel_account_session";
const PROFILES_STORAGE_KEY = "mel_user_profiles";
const FORUM_MEMBERSHIPS_STORAGE_KEY = "mel_forum_memberships";

type AccountContextValue = {
  users: RegisteredUser[];
  currentUser: RegisteredUser | null;
  currentProfile: UserProfile | null;
  isAuthenticated: boolean;
  totalForumPoints: number;
  registerUser: (input: AccountRegisterInput) => {
    ok: boolean;
    message: string;
  };
  loginUser: (input: AccountLoginInput) => {
    ok: boolean;
    message: string;
  };
  logoutUser: () => void;
  updateProfile: (profile: UserProfile) => void;
  refreshAccountData: () => void;
};

const AccountContext = createContext<AccountContextValue | null>(null);

function safeReadJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  const rawValue = window.localStorage.getItem(key);

  if (!rawValue) return fallback;

  try {
    return JSON.parse(rawValue) as T;
  } catch {
    return fallback;
  }
}

function saveJson<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function createId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function createDefaultProfile(user: RegisteredUser): UserProfile {
  return {
    userId: user.id,
    displayName: user.name,
    avatar: null,
    currentReading: "",
    readerStatus: "Buscando nueva lectura",
    bio: "Lector/a de Mundo Entre Libros.",
    favoriteGenre: "Novela Juvenil",
  };
}

function getStoredUsers() {
  return safeReadJson<RegisteredUser[]>(USERS_STORAGE_KEY, []);
}

function getStoredSession() {
  return safeReadJson<AccountSession | null>(SESSION_STORAGE_KEY, null);
}

function getStoredProfiles() {
  return safeReadJson<Record<string, UserProfile>>(PROFILES_STORAGE_KEY, {});
}

function getTotalForumPointsByUser(userId: string) {
  const memberships = safeReadJson<
    Record<string, Record<string, { points: number }>>
  >(FORUM_MEMBERSHIPS_STORAGE_KEY, {});

  const userMemberships = memberships[userId];

  if (!userMemberships) return 0;

  return Object.values(userMemberships).reduce(
    (total, membership) => total + membership.points,
    0,
  );
}

export function AccountProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<RegisteredUser[]>([]);
  const [session, setSession] = useState<AccountSession | null>(null);
  const [profiles, setProfiles] = useState<Record<string, UserProfile>>({});
  const [hasLoadedAccount, setHasLoadedAccount] = useState(false);
  const [accountRefreshKey, setAccountRefreshKey] = useState(0);

  useEffect(() => {
    setUsers(getStoredUsers());
    setSession(getStoredSession());
    setProfiles(getStoredProfiles());
    setHasLoadedAccount(true);
  }, []);

  useEffect(() => {
    if (!hasLoadedAccount) return;

    saveJson(USERS_STORAGE_KEY, users);
  }, [users, hasLoadedAccount]);

  useEffect(() => {
    if (!hasLoadedAccount) return;

    saveJson(PROFILES_STORAGE_KEY, profiles);
  }, [profiles, hasLoadedAccount]);

  useEffect(() => {
    if (!hasLoadedAccount) return;

    if (!session) {
      window.localStorage.removeItem(SESSION_STORAGE_KEY);
      return;
    }

    saveJson(SESSION_STORAGE_KEY, session);
  }, [session, hasLoadedAccount]);

  const currentUser = useMemo(() => {
    if (!session) return null;

    return users.find((user) => user.id === session.userId) ?? null;
  }, [users, session]);

  const currentProfile = useMemo(() => {
    if (!currentUser) return null;

    return profiles[currentUser.id] ?? createDefaultProfile(currentUser);
  }, [currentUser, profiles]);

  const totalForumPoints = useMemo(() => {
    if (!currentUser) return 0;

    accountRefreshKey;

    return getTotalForumPointsByUser(currentUser.id);
  }, [currentUser, accountRefreshKey]);

  function registerUser(input: AccountRegisterInput) {
    const cleanName = input.name.trim();
    const cleanEmail = normalizeEmail(input.email);
    const cleanPassword = input.password.trim();
    const cleanConfirmPassword = input.confirmPassword.trim();

    if (!cleanName || !cleanEmail || !cleanPassword || !cleanConfirmPassword) {
      return {
        ok: false,
        message: "Completa todos los campos para registrarte.",
      };
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return {
        ok: false,
        message: "Escribe un correo electrónico válido.",
      };
    }

    if (cleanPassword.length < 6) {
      return {
        ok: false,
        message: "La contraseña debe tener al menos 6 caracteres.",
      };
    }

    if (cleanPassword !== cleanConfirmPassword) {
      return {
        ok: false,
        message: "Las contraseñas no coinciden.",
      };
    }

    const emailAlreadyExists = users.some(
      (user) => normalizeEmail(user.email) === cleanEmail,
    );

    if (emailAlreadyExists) {
      return {
        ok: false,
        message: "Ya existe una cuenta registrada con ese correo.",
      };
    }

    const newUser: RegisteredUser = {
      id: createId("account"),
      name: cleanName,
      email: cleanEmail,
      password: cleanPassword,
      createdAt: new Date().toISOString(),
    };

    setUsers((currentUsers) => [...currentUsers, newUser]);

    setProfiles((currentProfiles) => ({
      ...currentProfiles,
      [newUser.id]: createDefaultProfile(newUser),
    }));

    setSession({
      userId: newUser.id,
      email: newUser.email,
    });

    return {
      ok: true,
      message: "Cuenta creada correctamente.",
    };
  }

  function loginUser(input: AccountLoginInput) {
    const cleanEmail = normalizeEmail(input.email);
    const cleanPassword = input.password.trim();

    if (!cleanEmail || !cleanPassword) {
      return {
        ok: false,
        message: "Escribe tu correo y contraseña.",
      };
    }

    const foundUser = users.find(
      (user) =>
        normalizeEmail(user.email) === cleanEmail &&
        user.password === cleanPassword,
    );

    if (!foundUser) {
      return {
        ok: false,
        message: "Correo o contraseña incorrectos.",
      };
    }

    setSession({
      userId: foundUser.id,
      email: foundUser.email,
    });

    setProfiles((currentProfiles) => {
      if (currentProfiles[foundUser.id]) return currentProfiles;

      return {
        ...currentProfiles,
        [foundUser.id]: createDefaultProfile(foundUser),
      };
    });

    return {
      ok: true,
      message: "Sesión iniciada correctamente.",
    };
  }

  function logoutUser() {
    setSession(null);
  }

  function updateProfile(profile: UserProfile) {
    setProfiles((currentProfiles) => ({
      ...currentProfiles,
      [profile.userId]: profile,
    }));
  }

  function refreshAccountData() {
    setAccountRefreshKey((currentValue) => currentValue + 1);
  }

  const value: AccountContextValue = {
    users,
    currentUser,
    currentProfile,
    isAuthenticated: Boolean(currentUser),
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