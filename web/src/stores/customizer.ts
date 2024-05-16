import { defineStore } from 'pinia';
import config from '@/config';
import type { ConfigProps } from '@/config';

export const useCustomizerStore = defineStore({
  id: 'customizer',
  state: (): ConfigProps => ({
    Sidebar_drawer: config.Sidebar_drawer,
    Customizer_drawer: config.Customizer_drawer,
    mini_sidebar: config.mini_sidebar,
    setHorizontalLayout: config.setHorizontalLayout, // Horizontal layout
    setRTLLayout: config.setRTLLayout, // RTL layout
    actTheme: config.actTheme,
    inputBg: config.inputBg,
    boxed: config.boxed,
    setBorderCard: config.setBorderCard,
  }),
  getters: {},
  actions: {
    SET_SIDEBAR_DRAWER() {
      this.Sidebar_drawer = !this.Sidebar_drawer;
    },
    SET_MINI_SIDEBAR(payload: boolean) {
      this.mini_sidebar = payload;
    },
    SET_CUSTOMIZER_DRAWER(payload: boolean) {
      this.Customizer_drawer = payload;
    },

    SET_LAYOUT(payload: boolean) {
      this.setHorizontalLayout = payload;
    },
    SET_THEME(payload: string) {
      this.actTheme = payload;
    },
    SET_CARD_BORDER(payload: boolean) {
      this.setBorderCard = payload;
    },
  },
});
