import { ref } from "vue";

export interface Item {
  id?: number;
  title: string;
  price: number;
  quantity: number;
  thumbnail: string;
}

export interface ItemB {
  id?: number;
  title: string;
}

export function useItemsList() {
  const items = ref<(Item | ItemB)[]>([]);

  function addItem(item: Item | ItemB) {
    items.value = [...items.value, item];
  }

  function removeItem(index: number) {
    items.value.splice(index, 1);
  }

  return {
    items,
    addItem,
    removeItem,
  };
}
