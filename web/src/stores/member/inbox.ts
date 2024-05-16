import { defineStore } from 'pinia';
import axios from '@/utils/axios';
import type {
  InboxStateType,
  InboxType,
  InboxDetailType,
  InboxMessageType,
  ResponseType,
} from '@/types/member';
import type { ApiResponseType } from '@/types/ApiResponseType';
import { useToast } from 'vue-toast-notification';
import { router } from '@/router';

export const useInboxStore = defineStore('Inbox', {
  state: (): InboxStateType => {
    return {
      list: {
        data: [],
        pageCount: 0,
      },
      detail: null,
      count: 0,
    };
  },
  getters: {
    getList(): InboxType[] {
      return this.list.data;
    },
    getPageCount(): number {
      return this.list.pageCount;
    },
    getDetail(): InboxDetailType | null {
      return this.detail;
    },
    getMessages(): InboxMessageType[] {
      return (
        this.detail?.message.sort((a, b) => {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        }) || []
      );
    },
    getCount(): number {
      return this.count;
    },
    isMessageMember(state) {
      return (memberId: string | null | undefined) => {
        return memberId === state.detail?.memberId;
      };
    },
  },
  actions: {
    async fetchInboxCount(id: string) {
      const { data } = await axios.get<ResponseType>(
        `/api/v1/Member/inboxs/count/${id}`
      );
      data.isResult && (this.count = parseInt(data.message));

      if (!data.isResult) {
        this.count = 0;
        const toast = useToast();
        toast.error(data.message || 'Fetch inbox count failed!');
      }
    },
    async fetchInboxList(
      id: string,
      type: 'all' | 'company' | 'product' = 'all',
      companiescode: string | undefined = undefined,
      page = 1) {
      const { data } = await axios.get<ApiResponseType<InboxType[]>>(
        `/api/v1/Member/inboxs/${id}`,
        {
          params: {
            page,
            type,
            companiescode,
          },
        }
      );

      if (data.isResult) {
        this.list = {
          data: data.data,
          pageCount: data.pageCount === 0 ? 1 : data.pageCount,
        };
      } else {
        this.list = {
          data: [],
          pageCount: 0,
        };
        const toast = useToast();
        toast.error(data.message || 'Fetch inbox failed!');
        router.back();
      }
    },
    async fetchInboxCustomerList(
      id: string,
      type: 'all' | 'company' | 'product' = 'all',
      companiescode: string | undefined = undefined,
      page = 1) {
      const { data } = await axios.get<ApiResponseType<InboxType[]>>(
        `/api/v1/Suppliers/inboxs/${id}`,
        {
          params: {
            page,
            type,
            companiescode,
          },
        }
      );

      if (data.isResult) {
        this.list = {
          data: data.data,
          pageCount: data.pageCount === 0 ? 1 : data.pageCount,
        };
      } else {
        this.list = {
          data: [],
          pageCount: 0,
        };
        const toast = useToast();
        toast.error(data.message || 'Fetch inbox failed!');
        router.back();
      }
    },
    async fetchInboxDetail(id: string) {
      const { data } = await axios.get<ApiResponseType<InboxDetailType>>(
        `/api/v1/Member/inboxs/detail/${id}`
      );

      if (data.isResult) {
        this.detail = data.data;
      } else {
        this.detail = null;
        const toast = useToast();
        toast.error(data.message || 'Fetch inbox detail failed!');
        router.back();
      }

      return data.isResult || false;
    },
    async fetchInboxCustomerDetail(id: string) {
      const { data, status } = await axios.get<ApiResponseType<InboxDetailType>>(
        `/api/v1/Suppliers/inboxs/detail/${id}`
      );

      if (data.isResult && status === 200) {
        this.detail = data.data;
      } else {
        this.detail = null;
        const toast = useToast();
        toast.error(data.message || 'Fetch inbox detail failed!');
        router.back();
      }
      
      return data.isResult || false;
    },
    async replyInbox(member: string, message: string) {
      const { data } = await axios.post<ResponseType>(
        `/api/v1/Member/inboxs/reply/${member}`,
        {
          objectId: this.detail?.objectId,
          message,
        }
      );

      if (!data.isResult) {
        const toast = useToast();
        toast.error(data.message || 'Reply inbox failed!');
      }
    },
    async replyInboxCustomer(member: string, message: string) {
      const { data } = await axios.post<ResponseType>(
        `/api/v1/Suppliers/inboxs/reply/${member}`,
        {
          objectId: this.detail?.objectId,
          message,
        }
      );
      
      if (!data.isResult) {
        const toast = useToast();
        toast.error(data.message || 'Reply inbox failed!');
      }
    },
    async readAllInbox(memberId: string) {
      const { data } = await axios.post<ResponseType>(
        `/api/v1/Member/inboxs/readall/${memberId}`
      );

      if (data.isResult) {
        const toast = useToast();
        toast.success(data.message || 'Read all inbox success!');
      } else {
        const toast = useToast();
        toast.error(data.message || 'Read all inbox failed!');
      }      
    },
    async readAllInboxCustomer(supplierId: string) {
      const { data } = await axios.post<ResponseType>(
        `/api/v1/Suppliers/inboxs/readall/${supplierId}`
      );

      if (data.isResult) {
        const toast = useToast();
        toast.success(data.message || 'Read all inbox success!');
      } else {
        const toast = useToast();
        toast.error(data.message || 'Read all inbox failed!');
      }
    },
    clearDetail() {
      this.detail = null;
    },
  },
});
