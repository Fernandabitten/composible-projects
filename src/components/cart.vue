<script lang="ts">
import { ref, computed, SetupContext } from "vue";
import billGen from "../components/billGen.vue";
import paymentPix from "../components/paymentPix.vue";

interface Item {
  thumbnail: string;
  title: string;
  quantity: number;
  price: number;
}

interface PaymentData {
  key: string;
  amount: number;
}

export default {
  props: {
    items: {
      type: Array as () => Item[],
      required: true,
      default: () => [],
    },
    headers: {
      type: Array as () => { text: string; value: string }[],
      required: true,
    },
    incrementItem: {
      type: Function as unknown as () => (item: Item) => void,
      required: true,
    },
    decrementItem: {
      type: Function as unknown as () => (item: Item) => void,
      required: true,
    },
    calculateTotal: {
      type: Function as unknown as () => (item: Item) => void,
      required: true,
    },
    deleteItem: {
      type: Function as unknown as () => (item: Item) => void,
      required: true,
    },
  },
  components: {
    billGen,
    paymentPix,
  },
  setup(props: {
    items: Item[];
    headers: { text: string; value: string }[];
    incrementItem: (item: Item) => void;
    decrementItem: (item: Item) => void;
    calculateTotal: (item: Item) => void;
    deleteItem: (item: Item) => void;
  }) {
    const paymentMethod = ref(""); // opção de pagamento selecionada

    const calculateItemTotal = (item: Item) => {
      return item.price * item.quantity;
    };

    const calculateTotalPrice = computed(() => {
      let totalPrice = 0;
      for (const item of props.items) {
        totalPrice += calculateItemTotal(item);
      }
      return totalPrice;
    });

    const pixPaymentData = ref<PaymentData>({
      key: "10001810148",
      amount: calculateTotalPrice.value,
    });
    const billPaymentData = ref({
      benficiario: "Empresa X LTDA",
      beneficiaryDocument: "000.000.000/0001",
      amount: calculateTotalPrice.value,
    });

    const payWithPix = (amount: number) => {
      const { key } = pixPaymentData.value;

      if (!key || key.trim() === "" || amount <= 0) {
        return;
      }

      const bankLinks = [
        "https://www.santander.com.br/",
        "https://www.bancodobrasil.com.br",
        "https://www.itau.com.br",
        "https://www.bradesco.com.br",
      ];

      const popup = window.open("", "_blank");

      if (popup) {
        popup.document.write(`<ul>`);
        bankLinks.forEach((link) => {
          popup.document.write(`<li><a href="${link}">${link}</a></li>`);
        });
        popup.document.write(`</ul>`);
      }
    };

    return {
      calculateItemTotal,
      calculateTotalPrice,
      paymentMethod,
      payWithPix,
      pixPaymentData,
      billPaymentData,
    };
  },
};
</script>

<template>
  <v-container fluid>
    <v-row v-if="items.length > 0">
      <v-col cols="12" lg="9" md="12">
        <v-table>
          <thead>
            <tr>
              <th v-for="header in headers" :key="header">
                {{ header.text }}
              </th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(item, index) in items" :key="index">
              <td>
                <img
                  :src="item.thumbnail"
                  width="50"
                  height="50"
                  alt="Product Image"
                />
              </td>
              <td style="word-wrap: break-word; max-width: 18ch">
                {{ item.title }}
              </td>
              <td>
                <v-btn
                  color="red"
                  variant="outlined"
                  size="small"
                  @click="decrementItem(item)"
                  :disabled="item.quantity === 0"
                >
                  <v-icon>mdi-minus</v-icon>
                </v-btn>
                <span class="ma-2">{{ item.quantity }}</span>
                <v-btn
                  color="blue"
                  variant="outlined"
                  size="small"
                  @click="incrementItem(item)"
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </td>
              <td>{{ item.price }}</td>
              <td>{{ calculateTotal(item) }}</td>
              <td>
                <v-btn
                  @click="deleteItem(index, item)"
                  color="red"
                  variant="outlined"
                  size="small"
                  >Excluir</v-btn
                >
              </td>
            </tr>

            <tr>
              <td colspan="3"></td>
              <td>
                <strong>Total</strong>
              </td>
              <td>
                <strong>{{ calculateTotalPrice }}</strong>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>

      <v-col
        cols="12"
        lg="3"
        md="12"
        v-if="calculateTotalPrice"
        class="mt-2 text-left"
      >
        <v-row>
          <v-col cols="12">
            <h3>
              <span>Total</span>
              <span class="text-blue"> R${{ calculateTotalPrice }},00 </span>
            </h3>
          </v-col>

          <v-col cols="12">
            <h3>Opções de Pagamento</h3>
          </v-col>

          <v-col>
            <label>
              <input type="radio" v-model="paymentMethod" value="boleto" />
              Boleto Bancário
            </label>
          </v-col>

          <v-col cols="12">
            <label>
              <input type="radio" v-model="paymentMethod" value="pix" /> Pix
            </label>
          </v-col>
        </v-row>

        <v-row v-if="paymentMethod === 'boleto'">
          <v-col>
            <billGen
              v-model="billPaymentData"
              :calculateTotalPrice="calculateTotalPrice"
            ></billGen>
          </v-col>
        </v-row>

        <v-row v-if="paymentMethod === 'pix'">
          <v-col>
            <paymentPix
              v-model="pixPaymentData"
              :calculateTotalPrice="calculateTotalPrice"
              @payWithPix="payWithPix"
            ></paymentPix>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>
