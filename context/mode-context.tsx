"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export type Mode = "admin" | "bidang";
export type BidangId = 1 | 2 | 3 | 4;

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  mode: Mode;
  bidangId?: BidangId;
  bidangName?: string;
  roleLabel: string;
  initials: string;
  gradient: string;
}

export const accounts: UserAccount[] = [
  {
    id: "admin",
    name: "Admin Kesbangpol",
    email: "admin@kesbangpol.go.id",
    mode: "admin",
    roleLabel: "Administrator Utama",
    initials: "AD",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    id: "bidang1",
    name: "Staff Verifikator Bidang 1",
    email: "bidang1@kesbangpol.go.id",
    mode: "bidang",
    bidangId: 1,
    bidangName: "Bidang Ideologi, Wawasan Kebangsaan & Karakter Bangsa",
    roleLabel: "Tim Evaluator Bidang 1",
    initials: "B1",
    gradient: "from-blue-600 to-indigo-700",
  },
  {
    id: "bidang2",
    name: "Staff Verifikator Bidang 2",
    email: "bidang2@kesbangpol.go.id",
    mode: "bidang",
    bidangId: 2,
    bidangName: "Bidang Politik Dalam Negeri & Organisasi Kemasyarakatan",
    roleLabel: "Tim Evaluator Bidang 2",
    initials: "B2",
    gradient: "from-red-600 to-rose-700",
  },
  {
    id: "bidang3",
    name: "Staff Verifikator Bidang 3",
    email: "bidang3@kesbangpol.go.id",
    mode: "bidang",
    bidangId: 3,
    bidangName: "Bidang Ketahanan Ekonomi, Sosbud & Agama",
    roleLabel: "Tim Evaluator Bidang 3",
    initials: "B3",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    id: "bidang4",
    name: "Staff Verifikator Bidang 4",
    email: "bidang4@kesbangpol.go.id",
    mode: "bidang",
    bidangId: 4,
    bidangName: "Bidang Kewaspadaan Nasional & Penanganan Konflik",
    roleLabel: "Tim Evaluator Bidang 4",
    initials: "B4",
    gradient: "from-purple-600 to-indigo-800",
  },
];

export const bidangInfo: Record<
  BidangId,
  { shortName: string; fullName: string; description: string; code: string; color: string }
> = {
  1: {
    shortName: "Bidang 1",
    fullName: "Ideologi & Wawasan Kebangsaan",
    description: "Pembinaan ideologi Pancasila, wawasan kebangsaan, dan bela negara.",
    code: "B1-IDW",
    color: "bg-blue-600",
  },
  2: {
    shortName: "Bidang 2",
    fullName: "Politik Dalam Negeri & Ormas",
    description: "Fasilitasi parpol, pemilu, serta pendaftaran & verifikasi ormas.",
    code: "B2-POL",
    color: "bg-red-600",
  },
  3: {
    shortName: "Bidang 3",
    fullName: "Ketahanan Ekonomi, Sosbud & Agama",
    description: "Ketahanan ekonomi, seni budaya, serta kerukunan umat beragama (FKUB).",
    code: "B3-ESA",
    color: "bg-amber-600",
  },
  4: {
    shortName: "Bidang 4",
    fullName: "Kewaspadaan Nasional & Konflik",
    description: "Deteksi dini, pemantauan orang asing, dan pencegahan konflik sosial.",
    code: "B4-KWN",
    color: "bg-purple-600",
  },
};

interface ModeContextType {
  mode: Mode;
  bidangId: BidangId;
  currentUser: UserAccount;
  isLoggedIn: boolean;
  loginWithAccount: (accountId: string) => void;
  logout: () => void;
  setMode: (mode: Mode) => void;
  setBidangId: (id: BidangId) => void;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<Mode>("admin");
  const [bidangId, setBidangIdState] = useState<BidangId>(1);
  const [currentUser, setCurrentUser] = useState<UserAccount>(accounts[0]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true); // Default true for initial view, updated on mount
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedLoggedIn = localStorage.getItem("kesbangpol_is_logged_in");
    const savedAccount = localStorage.getItem("kesbangpol_account_id");

    if (savedLoggedIn === "false") {
      setIsLoggedIn(false);
    } else {
      setIsLoggedIn(true);
    }

    if (savedAccount) {
      const found = accounts.find((a) => a.id === savedAccount);
      if (found) {
        setCurrentUser(found);
        setModeState(found.mode);
        if (found.bidangId) setBidangIdState(found.bidangId);
      }
    }
  }, []);

  const loginWithAccount = (accountId: string) => {
    const found = accounts.find((a) => a.id === accountId) || accounts[0];
    setCurrentUser(found);
    setModeState(found.mode);
    if (found.bidangId) setBidangIdState(found.bidangId);
    setIsLoggedIn(true);

    if (typeof window !== "undefined") {
      localStorage.setItem("kesbangpol_account_id", found.id);
      localStorage.setItem("kesbangpol_is_logged_in", "true");
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("kesbangpol_is_logged_in", "false");
    }
  };

  const setMode = (newMode: Mode) => {
    setModeState(newMode);
  };

  const setBidangId = (newBidangId: BidangId) => {
    setBidangIdState(newBidangId);
  };

  return (
    <ModeContext.Provider
      value={{
        mode,
        bidangId,
        currentUser: mounted ? currentUser : accounts[0],
        isLoggedIn: mounted ? isLoggedIn : true,
        loginWithAccount,
        logout,
        setMode,
        setBidangId,
      }}
    >
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  const context = useContext(ModeContext);
  if (!context) {
    throw new Error("useMode must be used within a ModeProvider");
  }
  return context;
}
