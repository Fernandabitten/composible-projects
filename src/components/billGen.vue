<script>
import { ref, toRefs, watch } from "vue";

export default {
  props: ["calculateTotalPrice"],
  setup(props) {
    const beneficiaryName = ref("Empresa X Ltda");
    const payerName = ref("");
    const beneficiaryDocument = ref("000.000.000/0001");
    const payerDocument = ref("");
    const { calculateTotalPrice } = toRefs(props);
    const amount = ref(calculateTotalPrice.value);
    const rules = {
      required: (value) => !!value || "Campo obrigatório",
    };

    watch(calculateTotalPrice, (newVal) => {
      amount.value = newVal;
    });
    const generateBarcode = (data) => {
      const barcodeData = data.replace(/[^\d]/g, ""); // Remove todos os caracteres não numéricos
      const barcode = "|" + barcodeData + "|"; // Adiciona os delimitadores de início e fim

      return barcode;
    };
    const generateFakeBoleto = () => {
      const banco = "santander";
      const issuance_date = new Date();
      const due_date = new Date(new Date().getTime() + 5 * 24 * 3600 * 1000); // 5 dias futuramente
      beneficiaryName;
      beneficiaryDocument;
      payerName;
      payerDocument;
      const totalDocument = amount.value.toFixed(2);
      const barcode = generateBarcode(
        beneficiaryDocument.value + payerDocument.value + totalDocument
      );

      // const generateBoleto = () => {
      //   const boleto = generateFakeBoleto();

      //   console.log("Boleto gerado:", boleto);
      // };

      const boleto = {
        banco,
        beneficiaryName,
        beneficiaryDocument,
        payerName,
        payerDocument,
        totalDocument,
        issuance_date,
        due_date,
        barcode,
        // generateBoleto,
      };

      return boleto;
    };

    const openBoletoWindow = () => {
      const boleto = generateFakeBoleto();
      const boletoWindow = window.open("", "_blank");
      const boletoHtml = `
        <html>
          <head>
            <title>Boleto</title>
          </head>
          <body>
            <h1>Boleto</h1>
            <p>Nome do beneficiário: ${boleto.beneficiaryName.value}</p>
            <p>CPF/CNPJ do beneficiário: ${boleto.beneficiaryDocument.value}</p>
            <p>Nome do pagador: ${boleto.payerName.value}</p>
            <p>CPF/CNPJ do pagador: ${boleto.payerDocument.value}</p>
            <p>Valor do documento: ${boleto.totalDocument}</p>
            <p>Código de barras: ${boleto.barcode}</p>
            <!-- Adicione outras informações do boleto conforme necessário -->
          </body>
        </html>
      `;
      boletoWindow.document.open();
      boletoWindow.document.write(boletoHtml);
      boletoWindow.document.close();
    };

    return {
      beneficiaryName,
      payerName,
      beneficiaryDocument,
      amount,
      payerDocument,
      rules,
      openBoletoWindow,
    };
  },
};
</script>
<template>
  <v-row class="text-left">
    <v-col class="pa-0 ma-0 mb-4" cols="12">
      <h4>Pagamento via Boleto</h4>
    </v-col>
    <v-col cols="12" class="pa-0 ma-0">
      <v-text-field
        v-model="beneficiaryName"
        type="text"
        label="Nome do beneficiário"
        disabled
        variant="outlined"
      ></v-text-field>
    </v-col>
    <v-col cols="12" class="pa-0 ma-0">
      <v-text-field
        v-model="beneficiaryDocument"
        label=">CPF/CNPJ do beneficiário"
        disabled
        variant="outlined"
      ></v-text-field>
    </v-col>
    <v-col cols="12" class="pa-0 ma-0 mb-1">
      <v-text-field
        v-model="payerName"
        type="input"
        label="Nome do pagador"
        :rules="[rules.required]"
        clearable
        variant="outlined"
        required
      ></v-text-field>
    </v-col>
    <v-col cols="12" class="pa-0 ma-0 mb-2">
      <v-text-field
        v-model="payerDocument"
        label="CPF/CNPJ do pagador"
        :rules="[rules.required]"
        variant="outlined"
      ></v-text-field>
    </v-col>
    <v-col cols="12" class="pa-0 ma-0">
      <v-text-field
        v-model="amount"
        label="Valor do documento"
        disabled
        variant="outlined"
      ></v-text-field>
    </v-col>
    <v-btn
      color="blue"
      @click="openBoletoWindow"
      :disabled="payerDocument && payerName ? false : true"
      variant="flat"
    >
      Gerar Boleto
    </v-btn>
  </v-row>
</template>
