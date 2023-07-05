<script lang="ts">
import { ref } from "vue";
import { useItemsList } from "../composables/useItemsList";

export default {
  setup() {
    const { items, addItem, removeItem } = useItemsList();

    const name = ref("");
    const selected = ref("");

    function handleOnChange(event: InputEvent) {
      const target = event.target as HTMLInputElement;
      name.value = target.value;
    }

    function addName() {
      addItem({
        title: name.value,
      });
      name.value = "";
    }

    function drawName() {
      const selectedIndex = Math.floor(Math.random() * items.value.length);
      selected.value = items.value[selectedIndex].title;
    }
    function deleteItem(index: number) {
      removeItem(index);
    }
    function clear() {
      items.value = [];
      selected.value = "";
    }
    return {
      name,
      selected,
      handleOnChange,
      addName,
      drawName,
      clear,
      deleteItem,
      items,
    };
  },
};
</script>
<template>
  <div class="ml-10">
    <v-row class="mt-5">
      <v-col>
        <v-text-field
          label="Insira um nome ou apelido"
          v-model="name"
          persistent-hint
          variant="outlined"
        ></v-text-field>
      </v-col>
      <v-col>
        <v-btn color="blue" variant="outlined" size="x-large" @click="addName">
          Adicionar nome
        </v-btn>
      </v-col>

      <v-col v-if="selected" cols="12">
        <h2>Vencedor: {{ selected }}</h2>
      </v-col>

      <v-col color="red" cols="12">
        <v-table v-if="items.length > 0">
          <thead>
            <tr>
              <th>Nome</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in items" :key="index">
              <td>{{ item.title }}</td>
              <td>
                <v-btn variant="text" @click="deleteItem(index, item)">
                  <v-icon class="ml-2" color="red" large>mdi-close</v-icon>
                </v-btn>
              </td>
              <td></td>
            </tr>
          </tbody>
        </v-table>
      </v-col>

      <v-col v-if="items.length > 0" cols="12">
        <v-row justify="start">
          <v-col cols="auto">
            <v-btn color="blue" size="x-large" @click="drawName">
              Sortear nome
            </v-btn>
          </v-col>
          <v-col cols="auto">
            <v-btn variant="tonal" class="ml-5" size="x-large" @click="clear">
              Limpar
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>
