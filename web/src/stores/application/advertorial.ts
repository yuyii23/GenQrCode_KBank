import { defineStore } from 'pinia';
import axios from '@/utils/axios';
import type {
  advertorialStateType,
  advertorialType,
  advertorialDetailType,
} from '@/types/application/AdvertorialType';
import type { ApiResponseType } from '@/types/ApiResponseType';
import { useToast } from 'vue-toast-notification';
import { router } from '@/router';

export const useAdvertorialStore = defineStore({
  id: 'Advertorial',
  state: (): advertorialStateType => ({
    advertorialList: [],
    pageCount: 0,
    advertorialDetail: null,
  }),
  getters: {
    getAdvertorialList(state): advertorialType[] {
      return state.advertorialList;
    },
    getPageCount(state): number {
      return state.pageCount;
    },
    getAdvertorialDetail(state): advertorialDetailType | null {
      return state.advertorialDetail;
    },
  },
  actions: {
    async fetchAdvertorial(pageNumber = 1) {
      const toast = useToast();
      try {
        const { data } = await axios.get<
          ApiResponseType<advertorialType[]>
        >('/api/v1/Advertorials', {
          params: {
            page: pageNumber,
          },
        });
        if (data.isResult) {
          this.advertorialList = data.data;
          this.pageCount = data.pageCount;
        } else {
          toast.error(data.message || 'Fetch Advertorial Error');
        }
      } catch (error) {
        toast.error('Fetch Advertorial Error');
        console.error(error);
      }
    },
    async fetchAdvertorialByFilter(filter: string, pageNumber = 1) {
      const toast = useToast();
      try {
        const { data } = await axios.get<
          ApiResponseType<advertorialType[]>
        >(`/api/v1/Advertorials/filter/${filter}`, {
          params: {
            page: pageNumber,
          },
        });
        if (data.isResult) {
          this.advertorialList = data.data;
          this.pageCount = data.pageCount;
        } else {
          toast.error(data.message || 'Fetch Advertorial Error');
        }
      } catch (error) {
        toast.error('Fetch Advertorial Error');
        console.error(error);
      }
    },
    async fetchAdvertorialDetail(objectId: number) {
      const toast = useToast();
      try {
        const { status, data } = await axios.get<
          ApiResponseType<advertorialDetailType>
        >(`/api/v1/Advertorials/${objectId}`);
        if (data.isResult) {
          this.advertorialDetail = data.data;
        } else {
          toast.error(data.message || 'Fetch Advertorial Detail Error');
          router.back();
        }
      } catch (error) {
        toast.error('Fetch Advertorial Detail Error');
        console.error(error);
        router.back();
      }
    },
  },
});
