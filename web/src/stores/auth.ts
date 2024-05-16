import { defineStore } from 'pinia';
import { router } from '@/router';

type authType = {
  user: object | null;
  returnUrl: string | null;
};

export const useAuthStore = defineStore({
  id: 'auth',
  state: (): authType => ({
    user: JSON.parse(localStorage.getItem('user') as string),
    returnUrl: null,
  }),
  actions: {
    async login(_username: string, _password: string) {
      router.push(this.returnUrl || '/dashboards/modern');
    },
    logout() {
      this.user = null;
      localStorage.removeItem('user');
      router.push('/');
    },
  },
});
