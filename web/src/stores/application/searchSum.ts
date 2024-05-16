import { defineStore } from 'pinia';
import axios from '@/utils/axios';
import type { SearchSumType, SearchSumStateType } from '@/types/Application';
import type { ApiResponseType } from '@/types/ApiResponseType';
import { useToast } from 'vue-toast-notification';

export const useSearchSumStore = defineStore({
  id: 'searchSum',
  state: (): SearchSumStateType => ({
    searchSum: {
      searchTrend: [],
      visitor: 0,
      business: 0,
    },
  }),
  getters: {
    getSearchTrend(): string[] {
      return this.searchSum.searchTrend;
    },
    getVisitor(): number {
      return this.searchSum.visitor;
    },
    getBusiness(): number {
      return this.searchSum.business;
    },
  },
  actions: {
    async fetchSearchSum() {
      const toast = useToast();
      try {
        const { status, data } = await axios.get<
          ApiResponseType<SearchSumType>
        >('/api/v1/Contents/statics');

        if (status === 200 && data.isResult) {
          this.searchSum = data.data;
        } else {
          toast.error(data.message || 'Fetch Search Sum Error');
        }
      } catch (error) {
        toast.error('Fetch Search Sum Error');
        console.error(error);
      }
    },
  },
});
