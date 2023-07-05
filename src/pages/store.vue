<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useItemsList } from "../composables/useItemsList";
import { useCounter } from "../composables/useCounter";
import carousel from "../components/carousel.vue";
import cart from "../components/cart.vue";

interface Item {
  id: number;
  title: string;
  price: number;
  quantity?: number;
  thumbnail: string;
  counter: Map<number, number>;
  increment: (id: number) => void;
  decrement: (id: number) => void;
}

interface Product {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
}
const { items, addItem, removeItem } = useItemsList();

const cartItems = ref<Item[]>([]);

function onItemAdded(item: Item) {
  const itemExists = items.value.some(
    (existingItem) => existingItem.id === item.id
  );
  if (!itemExists) {
    addItem(item);

    const { counters, increment, decrement } = useCounter();
    counters.set(item.id, 0);
    item.counter = counters;
    item.quantity = 1;
    item.increment = increment;
    item.decrement = decrement;
  }
}
function deleteItem(index: number, item: Item) {
  item.quantity = 0;
  removeItem(index);
}
function incrementItem(item: Item) {
  item.increment(item.id);
  item.quantity = item.counter.get(item.id);
}
function decrementItem(item: Item) {
  // if (item.quantity > 0) {
  if (item.quantity !== undefined && item.quantity > 0) {
    item.decrement(item.id);
    item.quantity = item.counter.get(item.id);
  }
}
function calculateTotal(item: Item) {
  // return item.price * item.quantity;
  if (item.quantity !== undefined) {
    return item.price * item.quantity;
  }
}
async function fetchCartItems() {
  try {
    const response = await fetch("https://dummyjson.com/products");
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }
    const data = await response.json();
    if (!data || !data.products) {
      throw new Error("Dados da API não estão no formato esperado");
    }
    cartItems.value = data.products.map((item: Product) => ({
      id: item.id,
      title: item.title,
      price: item.price,
      quantity: 0,
      thumbnail: item.thumbnail,
    }));
  } catch (error) {
    console.error("Erro ao buscar os itens:", error);
  }
}
const headers = [
  { text: "", value: "thumbnail" },
  { text: "", value: "title" },
  { text: "", value: "quantity" },
  { text: "Valor unitário", value: "price" },
  { text: "Total", value: "total" },
];
onMounted(fetchCartItems);
</script>
<template>
  <div>
    <h1>Store</h1>
    <carousel :cartItems="cartItems" @item-added="onItemAdded"></carousel>

    <cart
      :items="items"
      :headers="headers"
      :incrementItem="incrementItem"
      :decrementItem="decrementItem"
      :calculateTotal="calculateTotal"
      :deleteItem="deleteItem"
    ></cart>
  </div>
</template>
