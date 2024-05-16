import { defineStore, getActivePinia   } from 'pinia';
import axios from '@/utils/axios';
import type {
  AuthenticationStateType,
  RegisterType,
  ResponseType,
  ProfileType,
} from '@/types/member';
import type { ApiResponseType } from '@/types/ApiResponseType';
import { useToast } from 'vue-toast-notification';

export const useAuthenticationStore = defineStore('Authentication', {
  state: (): AuthenticationStateType => {
    return {
      memberId: null,
      isSupplier: null,
      username: null,
      pathImage: null,
      noRead: 0,
    };
  },
  persist: {
    paths: ['memberId', 'isSupplier', 'username', 'pathImage', 'noRead'],
  },
  getters: {
    getMemberId(): string | null {
      return this.memberId;
    },
    getIsSupplier(): boolean {
      return this.isSupplier || false;
    },
    getUsername(): string {
      return this.username || '';
    },
    getPathImage(): string {
      return this.pathImage || '';
    },
    getNoRead(): number {
      return this.noRead;
    },
  },
  actions: {
    async register(body: RegisterType): Promise<ResponseType> {
      const result = await axios.post<ResponseType>(
        '/api/v1/Member/register',
        body
      );

      if (!result.data.isResult) {
        const toast = useToast();
        toast.error(result.data.message || 'Register failed');
      }

      return result.data;
    },
    async login(username: string, password: string) {
      const { data } = await axios.post<
        ApiResponseType<ProfileType> | ResponseType
      >('/api/v1/Member/login', {
        username,
        password,
      });

      if (data.isResult) {
        const result = data as ApiResponseType<ProfileType>;
        this.memberId = result.data.objectId;
        this.isSupplier = result.data.isSupplier;
        this.username = result.data.userName;
        this.pathImage = result.data.pathImage;

        return;
      }

      const toast = useToast();
      toast.error(data.message || 'Login failed');

      return data as ResponseType;
    },
    async forgotPassword(email: string) {
      const { data } = await axios.post<ResponseType>(
        '/api/v1/Member/forget',
        {
          objectId: email,
        }
      );
      
      if (!data.isResult) {
        const toast = useToast();
        toast.error(data.message);
      }

      return data.isResult;
    },
    async changePassword(objectId: string, password: string) {
      const { data } = await axios.post<ResponseType>(
        '/api/v1/Member/changepassword',
        {
          objectId,
          password,
        }
      );

      const toast = useToast();

      if (data.isResult) {        
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
      
      return data.isResult;
    },
    async logout() {
      this.memberId = null;
      this.isSupplier = null;
      this.username = null;
      this.pathImage = null;
      this.noRead = 0;
      const store = getActivePinia();
      
      store?._s.forEach(store => {        
        if (store.$id === 'Authority') {
          return;
        }
        store.$reset()
      });
    },
    setNoRead(notRead: number) {
      this.noRead = notRead;
    },
    setUsername(username: string) {
      this.username = username;
    },
  },
});
