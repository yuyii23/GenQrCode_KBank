import axios from '@/utils/axios';
import { defineStore } from 'pinia';
import type { AuthorityType } from '@/types/authentication/AuthorityType';
import type { ApiResponseType } from '@/types/ApiResponseType';
const xApiKey = import.meta.env.VITE_APP_XAPIKEY;
const ownerId = import.meta.env.VITE_APP_OWNERID;

export const useAuthorityStore = defineStore('Authority', {
  state: (): AuthorityType => {
    return {
      authenkey: '',
      authenexpire: '',
    };
  },
  persist: {
    storage: sessionStorage,
    paths: ['authenkey', 'authenexpire'],
  },
  getters: {
    getAuthenKey(): string {
      return this.authenkey;
    },
    getAuthenExpire(): string {
      return this.authenexpire;
    },
  },
  actions: {
    async getAccessToken() {
      const body = {
        xApiKey: xApiKey,
        ownerId: ownerId,
      };

      const { data, status } = await axios.post<ApiResponseType<AuthorityType>>(
        '/api/v1/Authority',
        body
      );

      if (status === 200 && data.isResult) {
        this.authenkey = data.data.authenkey;
        this.authenexpire = data.data.authenexpire;
      }
    },
  },
});
