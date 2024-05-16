import { defineStore } from 'pinia';
import axios from '@/utils/axios';
import type {
  eventType,
  eventStateType,
  eventResponseType,
} from '@/types/Application/';
import type { ApiResponseType } from '@/types/ApiResponseType';
import { useToast } from 'vue-toast-notification';

export const useEventStore = defineStore('Event', {
  state: (): eventStateType => {
    return {
      eventList: [] as eventType[],
      pageCount: 0,
      imageAdPath: '',
      imageAdUrl: '',
    };
  },
  getters: {
    getEventList(): eventType[] {
      return this.eventList;
    },
    getPageCount(): number {
      return this.pageCount;
    },
    getImageAd(): { path: string; url: string } {
      return {
        path: this.imageAdPath as string,
        url: this.imageAdUrl as string,
      };
    },
  },
  actions: {
    async fetchEvent(pageNumber = 1) {
      const toast = useToast();
      try {
        const { data, status } = await axios.get<
          ApiResponseType<eventResponseType>
        >('/api/v1/Contents/events', {
          params: {
            page: pageNumber,
          },
        });

        if (status === 200 && data.isResult) {
          this.eventList = data.data.eventsList;
          this.imageAdPath = data.data.bannerPathImages;
          this.imageAdUrl = data.data.bannerUrl;
          this.pageCount = data.pageCount;
        } else {
          toast.error(data.message || 'Fetch Event List Error');
        }
      } catch (error) {
        toast.error('Fetch Event List Error');
        console.log(error);
      }
    },
    clearState(){
      this.imageAdPath = '';
      this.imageAdUrl = '';
    }
  },
});
