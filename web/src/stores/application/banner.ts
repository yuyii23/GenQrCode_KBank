import { defineStore } from 'pinia';
import axios from '@/utils/axios';
import type { ApiResponseType } from '@/types/ApiResponseType';
import type {
  bannerType,
  sectionHomePositionType,
  sectionCompanyPositionType,
  bannerStateType,
} from '@/types/Application/';
import { useToast } from 'vue-toast-notification';

export const useBannerStore = defineStore('Banner', {
  state: (): bannerStateType => {
    return {
      homeBanner: {
        top: [] as bannerType[],
        news: [] as bannerType[],
        event: [] as bannerType[],
        middle: [] as bannerType[],
        companies: [] as bannerType[],
        panel: [] as bannerType[],
      },
      companyBanner: {
        top: [] as bannerType[],
        middle1: [] as bannerType[],
        middle2: [] as bannerType[],
        companies: [] as bannerType[],
      },
      productBanner: {
        top: [] as bannerType[],
      },
      categoryBanner: {
        top: [] as bannerType[],
      },
    };
  },
  getters: {
    getHomeBannerList(state) {
      return (position: sectionHomePositionType): bannerType[] => {
        switch (position) {
          case 'Top':
            return state.homeBanner.top;
          case 'News':
            return state.homeBanner.news;
          case 'Event':
            return state.homeBanner.event;
          case 'Middle':
            return state.homeBanner.middle;
          case 'Companies':
            return state.homeBanner.companies;
          case 'Panel':
            return state.homeBanner.panel;
        }
      };
    },
    getCompanyBannerList(state) {
      return (position: sectionCompanyPositionType): bannerType[] => {
        switch (position) {
          case 'Top':
            return state.companyBanner.top;
          case 'Middle_1':
            return state.companyBanner.middle1;
          case 'Middle_2':
            return state.companyBanner.middle2;
          case 'Companies':
            return state.companyBanner.companies;
        }
      };
    },
    getProductBannerList(state) {
      return state.productBanner.top;
    },
    getCategoryBannerList(state) {
      return state.categoryBanner.top;
    },
  },
  persist: {
    storage: sessionStorage,
    paths: ['homeBanner'],
  },
  actions: {
    async fetchBannerHome(position: sectionHomePositionType) {
      const toast = useToast();
      try {
        const { data, status } = await axios.get<ApiResponseType<bannerType[]>>(
          `/api/v1/Contents/banner/Home/${position}`
        );

        if (!data.isResult) {
          toast.error(data.message || 'Fetch banner failed');
          return;
        }

        switch (position) {
          case 'Top':
            this.homeBanner.top = data.data;
            break;
          case 'News':
            this.homeBanner.news = data.data;
            break;
          case 'Event':
            this.homeBanner.event = data.data;
            break;
          case 'Middle':
            this.homeBanner.middle = data.data;
            break;
          case 'Companies':
            this.homeBanner.companies = data.data;
            break;
          case 'Panel':
            this.homeBanner.panel = data.data;
            break;
        }
      } catch (error) {
        toast.error('Fetch banner failed');
        console.log(error);
      }
    },
    async fetchBannerCompany(position: sectionCompanyPositionType) {
      const toast = useToast();
      try {
        const { data, status } = await axios.get<ApiResponseType<bannerType[]>>(
          `/api/v1/Contents/banner/Company/${position}`
        );

        if (!data.isResult) {
          toast.error(data.message || 'Fetch banner failed');
          return;
        }
        switch (position) {
          case 'Top':
            this.companyBanner.top = data.data;
            break;
          case 'Middle_1':
            this.companyBanner.middle1 = data.data;
            break;
          case 'Middle_2':
            this.companyBanner.middle2 = data.data;
            break;
          case 'Companies':
            this.companyBanner.companies = data.data;
            break;
        }
      } catch (error) {
        toast.error('Fetch banner failed');
        console.log(error);
      }
    },
    async fetchBannerProduct() {
      const toast = useToast();
      try {
        const { data, status } = await axios.get<ApiResponseType<bannerType[]>>(
          '/api/v1/Contents/banner/Product/Top'
        );

        if (status === 200 && data.isResult) {
          this.productBanner.top = data.data;
        } else {
          toast.error(data.message || 'Fetch banner failed');
        }
      } catch (error) {
        toast.error('Fetch banner failed');
        console.log(error);
      }
    },
    async fetchBannerCategory() {
      const toast = useToast();
      try {
        const { data, status } = await axios.get<ApiResponseType<bannerType[]>>(
          '/api/v1/Contents/banner/Category/Top'
        );

        if (status === 200 && data.isResult) {
          this.categoryBanner.top = data.data;
        } else {
          toast.error(data.message || 'Fetch banner failed');
        }
      } catch (error) {
        toast.error('Fetch banner failed');
        console.log(error);
      }
    },
  },
});
