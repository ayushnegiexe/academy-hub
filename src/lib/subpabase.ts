import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? "https://ijqgdqclvuepudqqjscd.supabase.co";
const supabaseKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ??
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
  "sb_publishable_ktEp6nxhT5PzjPbTrksTmA_EvxZOiiS";

const rememberMeStorageKey = "devsheel-admin-remember-me";
let authStorageKey: string | null = null;

export function setAdminAuthRememberMe(remember: boolean) {
  if (typeof window === "undefined") return;

  if (remember) {
    window.localStorage.setItem(rememberMeStorageKey, "true");
    if (authStorageKey) window.sessionStorage.removeItem(authStorageKey);
    return;
  }

  window.localStorage.removeItem(rememberMeStorageKey);
  if (authStorageKey) window.localStorage.removeItem(authStorageKey);
}

export const supabase =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          storage: {
            getItem: async (key) => {
              if (typeof window === "undefined") return null;
              authStorageKey = key;
              if (window.localStorage.getItem(rememberMeStorageKey) === "true") {
                return window.localStorage.getItem(key);
              }

              window.localStorage.removeItem(key);
              return window.sessionStorage.getItem(key);
            },
            setItem: async (key, value) => {
              if (typeof window === "undefined") return;
              authStorageKey = key;
              if (window.localStorage.getItem(rememberMeStorageKey) === "true") {
                window.sessionStorage.removeItem(key);
                window.localStorage.setItem(key, value);
              } else {
                window.localStorage.removeItem(key);
                window.sessionStorage.setItem(key, value);
              }
            },
            removeItem: async (key) => {
              if (typeof window === "undefined") return;
              authStorageKey = key;
              window.localStorage.removeItem(key);
              window.sessionStorage.removeItem(key);
            },
          },
        },
      })
    : null;
