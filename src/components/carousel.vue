<script lang="ts">
import { ref, toRefs, SetupContext } from "vue";

interface CartItem {
  title: string;
  price: number;
  thumbnail: string;
}

export default {
  props: {
    cartItems: {
      type: Array as () => CartItem[],
      required: true,
    },
  },
  setup(props: { cartItems: CartItem[] }, context: SetupContext) {
    const model = ref(null);
    const items = toRefs(props).cartItems;

    function addItemCart(item: CartItem) {
      context.emit("item-added", item);
    }

    return {
      model,
      addItemCart,
      items,
    };
  },
};
</script>
<template>
  <v-sheet max-width="900">
    <v-slide-group mobile-break-point="1000" show-arrows center-active>
      <template v-slot:next>
        <v-icon color="orange" large>mdi-hand-pointing-right</v-icon>
      </template>
      <template v-slot:prev>
        <v-icon color="orange" large>mdi-hand-pointing-left</v-icon>
      </template>

      <v-slide-group-item v-for="(item, index) in items" :key="index">
        <v-card class="ma-2">
          <v-card-title>
            <v-img
              height="100px"
              class="d-flex align-center justify-center"
              contain
              :src="item.thumbnail"
            >
            </v-img>
          </v-card-title>

          <v-card-text class="color-font"
            ><b
              >{{ item.title }}<br />
              R$ {{ item.price }},00</b
            >
          </v-card-text>

          <v-card-actions>
            <v-btn color="blue" text @click="addItemCart(item)">
              <b>Adicionar</b>
              <v-icon class="ml-2" color="orange" large>mdi-cart-plus</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-slide-group-item>
    </v-slide-group>
  </v-sheet>
</template>
