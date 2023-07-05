import { reactive } from "vue";

export function useCounter() {
  const counters = reactive(new Map());

  function increment(id: number) {
    const counter = counters.get(id) || 0;
    counters.set(id, counter + 1);
  }

  function decrement(id: number) {
    const counter = counters.get(id) || 0;
    if (counter > 0) {
      counters.set(id, counter - 1);
    }
  }
  return {
    counters,
    increment,
    decrement,
  };
}
