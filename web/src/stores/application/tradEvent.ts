import { defineStore } from 'pinia';
import axios from '@/utils/axios';
import type {
  TradeEventsType,
  upcomingEventType,
  pastEventGroupType,
} from '@/types/apps/TradeEventType';
import type { ApiResponseType } from '@/types/ApiResponseType';
import { useToast } from 'vue-toast-notification';

export const useTradeEventStore = defineStore('TradeEvent', {
  state: (): TradeEventsType => {
    return {
      countUpComing: 0,
      countPast: 0,
      countTotal: 0,
      upcoming: [] as upcomingEventType[],
      pastevents: [] as pastEventGroupType[],
    };
  },
  getters: {
    getUpcoming(): upcomingEventType[] {
      return this.upcoming;
    },
    getPastevents(): pastEventGroupType[] {
      return this.pastevents;
    },
    getCountUpComing(): number {
      return this.countUpComing;
    },
    getCountPast(): number {
      return this.countPast;
    },
    getCountTotal(): number {
      return this.countTotal;
    },
  },
  actions: {
    async fetchTradeEvent() {
      const toast = useToast();
      try {
        const { data, status } = await axios.get<
          ApiResponseType<TradeEventsType>
        >('api/v1/TradeEvents');

        if (status === 200 && data.isResult) {
          this.countUpComing = data.data.countUpComing;
          this.countPast = data.data.countPast;
          this.countTotal = data.data.countTotal;
          this.upcoming = data.data.upcoming;
          this.pastevents = data.data.pastevents;
        } else {
          toast.error(data.message || 'Failed to fetch trade event list');
        }
      } catch (error) {
        toast.error('Failed to fetch trade event list');
        console.log(error);
      }
    },
    async fetchTradeEventFile(filter: string) {
      const toast = useToast();
      try {
        const { data, status } = await axios.get<
          ApiResponseType<TradeEventsType>
        >(`api/v1/TradeEvents/${filter}`);

        if (status === 200 && data.isResult) {
          this.countUpComing = data.data.countUpComing;
          this.countPast = data.data.countPast;
          this.countTotal = data.data.countTotal;
          this.upcoming = data.data.upcoming;
          this.pastevents = data.data.pastevents;
        } else {
          toast.error(data.message || 'Failed to fetch trade event list');
        }
      } catch (error) {
        toast.error('Failed to fetch trade event list');
        console.log(error);
      }
    },
    orderByPastEvent(orderBy: 'ASC' | 'DESC') {
      this.pastevents =
        orderBy === 'ASC'
          ? this.pastevents.sort((a, b) => a.year - b.year || a.month - b.month)
          : this.pastevents.sort(
              (a, b) => b.year - a.year || b.month - a.month
            );
    },
  },
});
