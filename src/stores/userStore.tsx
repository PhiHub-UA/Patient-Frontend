import { create } from "zustand";

export const useUserStore = create((set) => ({

    username: null,
    loggedIn: false,

    logout: () => {localStorage.removeItem("token") ; set({ username: null, loggedIn: false});},

    login: (username: string) => set({ username: username, loggedIn: true})

}));
