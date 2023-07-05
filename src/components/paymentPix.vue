<script lang="ts">
import { ref, computed, SetupContext } from "vue";

export default {
  props: {
    modelValue: {
      type: Object,
      required: true,
    },
    calculateTotalPrice: {
      type: Number,
      required: true,
    },
  },

  emits: ["update:modelValue", "payWithPix"],
  setup(props: any, { emit }: SetupContext) {
    const pixPaymentData = ref({ key: "", amount: 0 });

    const maskedPixData = computed(() => {
      const maskedKey = props.modelValue?.key?.replace(/.(?=.{4})/g, "*");
      const amount = props.calculateTotalPrice;
      return {
        ...props.modelValue,
        ...props.calculateItemTotal,
        key: maskedKey,
        amount,
      };
    });

    const payWithPix = (amount: number) => {
      emit("payWithPix", amount);
    };

    return {
      pixPaymentData,
      maskedPixData,
      payWithPix,
    };
  },
};
</script>
<template>
  <v-row class="text-left">
    <v-col cols="12">
      <h4>Pagamento via Pix</h4>
    </v-col>
    <v-col class="mt-0 pt-0">
      <p>Chave Pix:</p>
      <input v-model="maskedPixData.key" disabled />
    </v-col>
    <v-col class="mt-0 pt-0">
      <label>Valor:</label>
      <input v-model="maskedPixData.amount" type="number" disabled />
    </v-col>
    <v-btn
      color="blue"
      @click="payWithPix(maskedPixData.amount)"
      variant="flat"
    >
      Pagar com Pix
    </v-btn>
  </v-row>
</template>
