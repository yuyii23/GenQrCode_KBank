<script setup>
import { ref } from 'vue';
import { useField, useForm } from 'vee-validate';
import { useToast } from 'vue-toast-notification';
import * as yup from 'yup';

const toast = useToast();

let dialog = ref(false);

const { handleSubmit } = useForm({
  validationSchema: {
    startDate: yup.string().required(),
    endDate: yup.string().required(),
  },
});

const password = useField('password');
const startDate = useField('startDate');
const endDate = useField('endDate');

const validate = handleSubmit(
  async (value) => {
    dialog.value = true;
  },
  () => {
    toast.error('กรุณากรอกวันที่เริ่มต้นและวันที่สิ้นสุด');
  },
);

const sendApi = async () => {
  const passwordConfig = import.meta.env.VITE_APP_PASSWORD_EXPORT;

  if (!password.value.value || password.value.value === '') {
    toast.error('กรุณากรอกรหัสผ่าน');
    dialog.value = false;
    return;
  }
  if (password.value.value !== passwordConfig) {
    toast.error('รหัสผ่านไม่ถูกต้อง');
    password.value.value = '';
    dialog.value = false;
    return;
  }

  const baseApiUrl = import.meta.env.VITE_API_URL_PRODUCTION;
  const link = document.createElement('a');
  link.href = `${baseApiUrl}api/export?start_date=${startDate.value.value}&end_date=${endDate.value.value}`;
  link.setAttribute('download', 'exportUserUseQrCode.xlsx');
  document.body.appendChild(link);
  link.click();

  password.value.value = '';
  dialog.value = false;
};
</script>

<template>
  <VContainer fluid>
    <VRow>
      <VCol cols="12" class="mt-5"> </VCol>
      <VCol cols="12" class="mt-5">
        <v-card class="mx-auto my-8 bg-white border-0 pa-5" elevation="3">
          <v-card-item>
            <h2 class="text-center">Report Data</h2>
          </v-card-item>
          <VRow>
            <VCol cols="6" class="mt-5">
              <v-text-field
                label="วันที่เริ่มต้น"
                hide-details
                type="date"
                class="w-100"
                v-model="startDate.value.value"
                :error-messages="startDate.errorMessage.value"
              />
            </VCol>
            <VCol cols="6" class="mt-5">
              <v-text-field
                label="วันที่เริ่มสิ้นสุด"
                hide-details
                type="date"
                class="w-100"
                v-model="endDate.value.value"
                :error-messages="endDate.errorMessage.value"
              />
            </VCol>
          </VRow>
          <VBtn
            color="primary"
            size="large"
            class="d-block mx-auto w-100 mt-5"
            @click="validate"
          >
            Export
          </VBtn>
        </v-card>
      </VCol>
    </VRow>
  </VContainer>

  <v-dialog v-model="dialog" max-width="400" persistent>
    <v-card class="pb-white w-100">
      <v-form @submit.prevent>
        <VRow class="w-100 ma-0">
          <VCol cols="12">
            <v-text-field
              label="รหัสผ่าน"
              type="password"
              class="w-100"
              variant="outlined"
              v-model="password.value.value"
              :error-messages="password.errorMessage.value"
            />
          </VCol>
          <VCol cols="12">
            <div class="d-flex justify-end">
              <v-btn @click="dialog = false" variant="text" size="large">
                ยกเลิก
              </v-btn>
              <v-btn @click="sendApi" size="large"> ตกลง </v-btn>
            </div>
          </VCol>
        </VRow>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<style lang="scss" scoped>
.v-card {
  background-color: #fff;
  padding: 2rem 0;
}
.v-overlay__scrim {
  background: #000000a3;
}
</style>
