import { defineStore } from 'pinia';
import axios from '@/utils/axios';
import type { ContactStateType, SubjectType } from '@/types/Application';
import type { ApiResponseType } from '@/types/ApiResponseType';
import type { DropDownListType } from '@/types/DropDownListType';
import { useToast } from 'vue-toast-notification';

export const useContactStore = defineStore('Contact', {
  state: (): ContactStateType => {
    return {
      subjectList: [],
    };
  },
  getters: {
    getDropDownSubject(): DropDownListType[] {
      return this.subjectList.map((item) => ({
        value: item.code,
        title: item.name,
      }));
    },
  },
  actions: {
    async fetchSubject() {
      const toast = useToast();
      try {
        const { data, status } = await axios.get<
          ApiResponseType<SubjectType[]>
        >('/api/v1/Contact/parameter/subject');
        if (status === 200 && data.isResult) {
          this.subjectList = data.data;
        } else {
          toast.error(data.message || 'Failed to fetch subject list');
        }
      } catch (error) {
        toast.error('Failed to fetch subject list');
        console.log(error);
      }
    },
    async sendContact(
      name: string,
      email: string,
      subjectId: string,
      message: string,
      ipAddress: string
    ) {
      const toast = useToast();
      try {
        const { data, status } = await axios.post<ApiResponseType<null>>(
          '/api/v1/Contact',
          {
            name,
            email,
            subjectId,
            message,
            ipAddress,
          }
        );        

        if (status === 200 && data.isResult) {
          toast.success(data.message || 'Message sent successfully');
        } else {
          toast.error(data.message || 'Failed to send message');
        }
      } catch (error) {
        toast.error('Failed to send message');
        console.log(error);
      }
    },
  },
});
