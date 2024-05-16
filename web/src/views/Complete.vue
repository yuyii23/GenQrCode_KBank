<template>
  <VContainer class="h-100">
    <img
      src="@/assets/logo_01.png"
      alt="logo"
      width="300"
      class="mx-auto d-block pt-10 mb-10"
    />
    <VRow justify="center" class="form">
      <VCol cols="12">
        <img
          src="@/assets/Text_02.png"
          alt="img-complete"
          width="300"
          class="d-block my-10 img-complete"
        />
      </VCol>
      <VCol cols="12" md="8" class="VBtn d-flex justify-center">
        <a href="/" class="mt-10">
          <img src="@/assets/confirm.png" alt="logo" height="100" />
        </a>
      </VCol>
    </VRow>
  </VContainer>
</template>
<style lang="scss" scoped>
.VBtn {
  position: absolute;
  bottom: 35px;
  left: 50%;
  transform: translate(-50%, -50%);
  .bg-primary {
    background-color: transparent !important;
  }
}
.img-complete {
  width: 100%;
}
</style>
