import { defineStore } from 'pinia';
import axios from '@/utils/axios';
import type {
  MemberStateType,
  ProfileType,
  ProfileGeneralType,
  ProfileSuppliersType,
  ResponseType,
  RequestType,
} from '@/types/member';
import type { ApiResponseType } from '@/types/ApiResponseType';
import { useToast } from 'vue-toast-notification';
import { router } from '@/router';

export const useMemberStore = defineStore('Member', {
  state: (): MemberStateType => {
    return {
      profile: null,
      profileInbox: null,
      countSupplier: 0,
      countCompany: 0,
      countProduct: 0,
      countAdvertorial: 0,
      countRequest: 0,
      noRead: 0,
      requests: [],
      totalPage: 0,
    };
  },
  getters: {
    getProfile(): ProfileType | null {
      return this.profile;
    },
    getProfileInbox(): ProfileType | null {
      return this.profileInbox;
    },
    getCountSupplier(): number {
      return this.countSupplier;
    },
    getCountCompany(): number {
      return this.countCompany;
    },
    getCountProduct(): number {
      return this.countProduct;
    },
    getCountAdvertorial(): number {
      return this.countAdvertorial;
    },
    getNoRead(): number {
      return this.noRead;
    },
    getIsInvisible(): boolean {
      return this.profile?.isInvisible || false;
    },
    getRequests(): RequestType[] {
      return this.requests;
    },
    getCountRequest(): number {
      return this.countRequest;
    },
    getTotalPage(): number {
      return this.totalPage;
    },
  },
  actions: {
    async fetchProfile(id: string) {
      const { data } = await axios.get<ApiResponseType<ProfileGeneralType>>(
        `/api/v1/Member/profile/${id}`
      );
      if (data.isResult) {
        this.profile = data.data.profile;
        this.noRead = data.data.noRead;

        return;
      }

      this.profile = null;
      const toast = useToast();
      toast.error(data.message || 'Fetch profile failed');
      router.back();
    },
    async fetchProfileSuppliers(
      id: string,
      page = 1,
      type: 'all' | 'company' | 'product' | 'ads' | 'claim' = 'all') {
      const { data } = await axios.get<ApiResponseType<ProfileSuppliersType>>(
        `/api/v1/Suppliers/profile/${id}`,
        {
          params: {
            page,
            type,
          },
        }
      );

      if (data.isResult) {
        this.profile = data.data.profile;
        this.countCompany = data.data.countCompany;
        this.countProduct = data.data.countProduct;
        this.countAdvertorial = data.data.countAdvertirial;
        this.countRequest = data.data.countRequest;
        this.noRead = data.data.noRead;
        this.requests = data.data.request;
        this.totalPage = data.pageCount;

        return;
      }

      this.profile = null;
      this.requests = [];
      this.totalPage = 0;
      
      const toast = useToast();
      toast.error(data.message || 'Fetch profile failed');
      router.back();
    },
    async fetchProfileInbox(id: string) {
      const { data } = await axios.get<ApiResponseType<ProfileGeneralType>>(
        `/api/v1/Member/profile/${id}`
      );
      if (data.isResult) {
        this.profileInbox = data.data.profile;

        return;
      }

      this.profile = null;
      const toast = useToast();
      toast.error(data.message || 'Fetch profile failed');
      router.back();
    },
    async fetchProfileSuppliersInbox(id: string) {
      const { data } = await axios.get<ApiResponseType<ProfileSuppliersType>>(
        `/api/v1/Suppliers/profile/${id}`,
        {
          params: {
            page: 1,
            type: 'all',
          },
        }
      );

      if (data.isResult) {
        this.profileInbox = data.data.profile;

        return;
      }

      this.profile = null;
      
      const toast = useToast();
      toast.error(data.message || 'Fetch profile failed');
      router.back();
    },
    async updateProfileMember(
      name: string,
      lastname: string,
      email: string,
      telephone: string,
      password: string | undefined,
      isInvisible: boolean,
      imageFile: File | null = null
    ) {

      const formData = new FormData();
      formData.append('objectId', this.profile?.objectId || '');
      formData.append('nameTH', name);
      formData.append('lastnameTH', lastname);
      formData.append('nameEN', name);
      formData.append('lastnameEN', lastname);
      formData.append('email', email);
      formData.append('telephone', telephone);
      formData.append('isInvisible', isInvisible ? 'true' : 'false');
      if (password) {
        formData.append('password', password);
      }
      if (imageFile !== null) {
        formData.append('isChangePicture', 'true');
        formData.append('imageFile', imageFile);
      }

      const { data } = await axios.postForm<ResponseType>(
        '/api/v1/Member/profile',
        formData
      );

      const toast = useToast();

      if (data.isResult || false) {
        toast.success(data.message || 'Update profile success');
      } else {
        toast.error(data.message || 'Update profile failed');
      }

      return data.isResult || false;
    },
    async updateProfileSuppliers(
      name: string,
      lastname: string,
      email: string,
      telephone: string,
      password: string | undefined,
      imageFile: File | null = null
    ) {
      const formData = new FormData();
      formData.append('objectId', this.profile?.objectId || '');
      formData.append('nameTH', name);
      formData.append('lastnameTH', lastname);
      formData.append('nameEN', name);
      formData.append('lastnameEN', lastname);
      formData.append('email', email);
      formData.append('telephone', telephone);
      if (password) {
        formData.append('password', password);
      }
      if (imageFile !== null) {
        formData.append('isChangePicture', 'true');
        formData.append('imageFile', imageFile);
      }
      const { data } = await axios.post<ResponseType>(
        '/api/v1/Suppliers/profile',
        formData
      );

      const toast = useToast();

      if (data.isResult || false) {
        toast.success(data.message || 'Update profile success');
      } else {
        toast.error(data.message || 'Update profile failed');
      }

      return data.isResult || false;
    },
    clearProfile() {
      this.profile = null;
    },
    clearProfileInbox() {
      this.profileInbox = null;
    },
  },
});
