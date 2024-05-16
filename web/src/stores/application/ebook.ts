import { defineStore } from 'pinia';
import axios from '@/utils/axios';
import type { ebookType, ebookStateType } from '@/types/Application';
import type { ApiResponseType } from '@/types/ApiResponseType';
import { useToast } from 'vue-toast-notification';

export const useEbookStore = defineStore({
  id: 'ebook',
  state: (): ebookStateType => ({
    ebook: [],
  }),
  getters: {
    getEbook(): ebookType[] {
      return this.ebook;
    },
  },
  actions: {
    async fetchEbook() {
      const toast = useToast();
      try {
        const { status, data } = await axios.get<ApiResponseType<ebookType[]>>(
          '/api/v1/Contents/ebook'
        );

        if (status === 200 && data.isResult) {
          this.ebook = data.data;
        } else {
          toast.error(data.message || 'Fetch Ebook Error');
        }
      } catch (error) {
        toast.error('Fetch Ebook Error');
        console.error(error);
      }
    },
  },
});
