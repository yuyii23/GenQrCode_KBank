<script setup lang="ts">
import { ref, onMounted } from 'vue';
import QrcodeVue from 'qrcode.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const value = ref('qrcode');
const level = ref<any>('L');
const renderAs = ref<any>('svg');

onMounted(() => {
  const qrCode = router.currentRoute.value.params.id as string;
  value.value = qrCode;
});
</script>

<template>
  <VContainer class="h-100">
    <ToastPlugin />
    <img
      src="@/assets/logo_01.png"
      alt="logo"
      width="300"
      class="mx-auto d-block pt-10 mb-10"
    />
    <VRow justify="center" class="form">
      <VCol cols="12" class="d-flex justify-center">
        <div class="qrcode">
          <qrcode-vue
            :value="value"
            :level="level"
            :render-as="renderAs"
            :size="150"
          />
        </div>
      </VCol>
      <VCol cols="9" md="8" class="d-flex justify-center">
        <img
          src="@/assets/Text_03.png"
          alt="logo"
          class="img-complete"
          width="300"
        />
      </VCol>
    </VRow>
  </VContainer>
</template>
<style lang="scss" scoped>
.qrcode {
  background-color: white;
  padding: 10px;
  border-radius: 10px;
}
.img-complete {
  width: 300px;
}
</style>
