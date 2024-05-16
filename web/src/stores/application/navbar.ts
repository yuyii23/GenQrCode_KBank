import { defineStore } from 'pinia';
import axios from '@/utils/axios';
import type { NavbarType, NavbarStateType } from '@/types/Application/';
import type { ApiResponseType } from '@/types/ApiResponseType';
import { useToast } from 'vue-toast-notification';

export const useNavbarStore = defineStore('Navbar', {
  state: (): NavbarStateType => {
    return {
      navbarList: [] as NavbarType[],
      navbar: null,
    };
  },
  persist: {
    storage: sessionStorage,
    paths: ['navbar'],
  },
  getters: {
    getNavbarList(): NavbarType[] {
      return this.navbarList;
    },
    getNavbar(): NavbarType | null {
      return this.navbar;
    },
  },
  actions: {
    async fetchNavbar() {
      const toast = useToast();
      try {
        const { data, status } = await axios.get<ApiResponseType<NavbarType[]>>(
          '/api/v1/Navbar'
        );

        if (status === 200 && data.isResult) {
          this.navbarList = data.data;
        } else {
          toast.error(data.message || 'Fetch Navbar List Error');
        }
      } catch (error) {
        toast.error('Fetch Navbar List Error');
        console.log(error);
      }
    },
    setNavbarById(id: string) {
      this.navbar = this.navbarList.find((item) => item.objectId === id) || null;
    }
  },
});
