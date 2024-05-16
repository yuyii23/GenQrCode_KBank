<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from '@/utils/axios';
import { useRouter } from 'vue-router';
import { useField, useForm } from 'vee-validate';
import { useToast } from 'vue-toast-notification';

const toast = useToast();
let onClick = ref(false);
const router = useRouter();
const { handleSubmit } = useForm({
  validationSchema: {
    phone(value: string) {
      if (!value) {
        onClick.value = true;
        toast.error('กรุณากรอกเบอร์โทรศัพท์');
        setTimeout(() => {
          onClick.value = false;
        }, 3000);
      }
      return true;
    },
  },
});

const phone = useField<string>('phone');

const onSubmitForm = handleSubmit(async (value) => {
  const { data } = await axios.get(`/check-phone?phone_number=${value.phone}`);
  if (data.is_registered) {
    value != undefined && router.push('/complete');
  } else {
    const { data } = await axios.post(`/register`, {
      phone_number: value.phone,
    });
    if (data.qrCode) {
      router.push('/qr-code/' + data.qrCode);
    } else {
      value != undefined && router.push('/complete');
    }
  }
});
</script>

<template>
  <VContainer class="h-100">
    <img
      src="@/assets/logo_01.png"
      alt="logo"
      width="300"
      class="mx-auto d-block pt-10 mb-10"
    />
    <VForm validate-on="submit lazy" @submit.prevent="onSubmitForm">
      <VRow justify="center" class="form">
        <VCol cols="12" md="8">
          <div class="form-input">
            <VTextField
              v-model="phone.value.value"
              variant="outlined"
              hide-details
              label=""
              name="phone"
              placeholder="กรอกเบอร์โทร"
            />
          </div>
          <p
            :class="
              phone.errorMessage.value !== '' ? 'text-error' : 'text-white'
            "
            class="text-center mt-2 text-white"
          >
            * กรุณากรอกเบอร์โทรศัพท์ของท่าน
          </p>
        </VCol>
        <VCol cols="12" md="8" class="VBtn d-flex justify-center">
          <button :disabled="onClick">
            <img src="@/assets/confirm.png" alt="logo" height="100" />
          </button>
        </VCol>
      </VRow>
    </VForm>
  </VContainer>
</template>
<style lang="scss" scoped>
.VBtn {
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
