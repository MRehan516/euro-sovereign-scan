import { useSyncExternalStore } from "react";

import type { ScanResult } from "./scoring";

export type ScanSession = {
  result: ScanResult;
  report: string | null;
};

const KEY = "sovereigngate.session";

let session: ScanSession | null = null;
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (raw) session = JSON.parse(raw) as ScanSession;
  } catch {
    session = null;
  }
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    if (session) window.sessionStorage.setItem(KEY, JSON.stringify(session));
    else window.sessionStorage.removeItem(KEY);
  } catch {
    // storage unavailable; in-memory state still works
  }
}

export function setScanResult(result: ScanResult) {
  session = { result, report: null };
  persist();
  emit();
}

export function setScanReport(report: string) {
  if (!session) return;
  session = { ...session, report };
  persist();
  emit();
}

export function clearScan() {
  session = null;
  persist();
  emit();
}

export function useScanSession(): ScanSession | null {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => {
      hydrate();
      return session;
    },
    () => null,
  );
}
