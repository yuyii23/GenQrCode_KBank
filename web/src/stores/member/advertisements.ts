import { defineStore } from 'pinia';
import axios from '@/utils/axios';
import type {
  AdvertisementsStateType,
  AdvertisementsType,
  AddAdvertisementsDetailType,
  SectionPreviewType,
  ResponseType,
} from '@/types/Member/';
import type { ApiResponseType } from '@/types/ApiResponseType';
import { useToast } from 'vue-toast-notification';
import { router } from '@/router';

export const useAdvertisementsStore = defineStore('Advertisements', {
  state: (): AdvertisementsStateType => {
    return {
      list: {
        data: [] as AdvertisementsType[],
        totalPage: 0,
      },
      detail: null,
      sectionPreview: null,
    };
  },
  getters: {
    getList(): AdvertisementsType[] {
      return this.list.data;
    },
    getTotalPage(): number {
      return this.list.totalPage;
    },
    getDetail(): AddAdvertisementsDetailType | null {
      return this.detail;
    },
    getSectionPreview(): SectionPreviewType | null {
      return this.sectionPreview;
    },
  },
  actions: {
    async addAdvertisement(
      supplierId: string,
      coobjectId: string,
      pictureFile: File,
      section: string,
      position: string,
      time: number
    ) {
      const formData = new FormData();
      formData.append('coobjectId', coobjectId);
      formData.append('section', section);
      formData.append('position', position);
      formData.append('time', time.toString());
      formData.append('pictureFile', pictureFile);

      const { data } = await axios.post<ResponseType>(
        `/api/v1/Suppliers/request/ads/add/${supplierId}`,
        formData
      );

      const toast = useToast();

      if (data.isResult || false) {
        toast.success(data.message || 'Add advertisement success');
      } else {
        toast.error(data.message || 'Add advertisement failed');
      }

      return data.isResult || false;
    },
    async fetchAdvertisements(
      supplierId: string,
      page = 1,
      type: 'all' | 'last' | 'old' = 'all',
      companiescode: string | undefined = undefined
    ) {
      const { data, status } = await axios.get<ApiResponseType<AdvertisementsType[]>>(
        `/api/v1/Suppliers/advertisement/${supplierId}`,
        {
          params: {
            page,
            type,
            companiescode,
          },
        }
      );

      if (status === 200 && data.isResult) {
        this.list = {
          data: data.data,
          totalPage: data.pageCount === 0 ? 1 : data.pageCount,
        };
      }
      else {
        this.list = {
          data: [],
          totalPage: 0,
        };
        const toast = useToast();
        toast.error(data.message || 'Fetch advertisements failed!');
        router.back();
      }
    },
    async fetchAdvertisementsDetail(
      supplierId: string,
      advertisementId: string) {
      const { data, status } = await axios.get<ApiResponseType<AddAdvertisementsDetailType>>(
        `/api/v1/Suppliers/advertisement/detail/${supplierId}`,
        {
          params: {
            adsid: advertisementId,
          },
        }
      );

      if (status === 200 && data.isResult) {
        this.detail = data.data;
      }
      else {
        this.detail = null;
        const toast = useToast();
        toast.error(data.message || 'Fetch advertisement detail failed!');
        router.back();
      }
    },
    async fetchSectionPreview(code: string) {
      const { data, status } = await axios.get<ApiResponseType<SectionPreviewType>>(
        `/api/v1/Suppliers/master/section/preview`,
        {
          params: {
            code,
          },
        }
      );

      if (status === 200 && data.isResult) {
        this.sectionPreview = data.data;
      }
      else {
        this.sectionPreview = null;
        const toast = useToast();
        toast.error(data.message || 'Fetch section preview failed!');
      }
    },
    async updateAdvertisement(
      supplierId: string,
      adsObjectId: string,
      topicId: string,
      detail: string) {
      const { data } = await axios.post<ResponseType>(
        `/api/v1/Suppliers/request/ads/update/${supplierId}`,
        {
          adsObjectId,
          topicId,
          detail,
        }
      );

      const toast = useToast();
      if (data.isResult) {
        toast.success(data.message || 'Update advertisement success');
      } else {
        toast.error(data.message || 'Update advertisement failed');
      }

      return data.isResult || false;
    },
    clearDetail() {
      this.detail = null;
    },
    clearSectionPreview() {
      this.sectionPreview = null;
    },
    clearList() {
      this.list = {
        data: [],
        totalPage: 0,
      };
    },
  },
});