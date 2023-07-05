<script lang="ts">
import { computed, ref } from "vue";
import { useCounter } from "../composables/useCounter";

export default {
  setup() {
    const workDuration = ref<number>(25);
    const breakDuration = ref<number>(5);
    const isRunning = ref<boolean>(false);
    const disableInput = ref(false);
    const currentTime = ref<number>(0);
    let audio: HTMLAudioElement | null = null;
    let timeoutId: number;
    const { increment } = useCounter();

    const START_SOUND = ref<string>(
      "https://raw.githubusercontent.com/muhammederdem/mini-player/master/mp3/2.mp3"
    );
    const END_SOUND = ref<string>(
      "http://docs.google.com/uc?export=open&id=1OFKrdi5BygFnjl2WzNWEOkCUZTpEOVhf"
    );
    const ONE_SECOND_IN_MILLISECONDS = 1000;
    const ONE_MINUTE_IN_MILLISECONDS = 60000;

    const totalWorkTime = computed(
      () => workDuration.value * ONE_MINUTE_IN_MILLISECONDS
    );

    function startTimer() {
      isRunning.value = true;
      runTimer(totalWorkTime.value);

      audio = new Audio(START_SOUND.value);
      audio.play();
    }

    function runTimer(duration: number) {
      if (duration <= 0) {
        increment(0);
        stopTimer();
        audio = new Audio(END_SOUND.value);
        audio.play();
        return;
      }
      currentTime.value = duration;
      timeoutId = setTimeout(() => {
        runTimer(duration - ONE_SECOND_IN_MILLISECONDS);
      }, ONE_SECOND_IN_MILLISECONDS);
    }

    function stopTimer() {
      isRunning.value = false;
      clearTimeout(timeoutId);
      currentTime.value = 0;
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    }

    function formatTime(time: number) {
      const minutes = Math.floor(time / ONE_MINUTE_IN_MILLISECONDS);
      const seconds = Math.floor(
        (time % ONE_MINUTE_IN_MILLISECONDS) / ONE_SECOND_IN_MILLISECONDS
      );
      return `${padZero(minutes)}:${padZero(seconds)}`;
    }

    function padZero(value: number) {
      return value.toString().padStart(2, "0");
    }

    const positiveNumberRule = (value: number) => {
      if (!value) {
        return "Digite um número maior que 0";
      }
      const number = Number(value);
      if (isNaN(number) || number <= 0) {
        disableInput.value = true;
        return "Digite um número válido maior que 0";
      } else {
        disableInput.value = false;
      }
      return true;
    };

    const handleInput = () => {
      if (disableInput.value) {
        workDuration.value = 25;
      }
    };

    return {
      workDuration,
      breakDuration,
      isRunning,
      currentTime,
      startTimer,
      stopTimer,
      formatTime,
      positiveNumberRule,
      handleInput,
    };
  },
};
</script>

<template>
  <v-card color="#952175" theme="dark" max-width="200">
    <v-card-title class="text-h4 text-center mt-2">Timer</v-card-title>
    <v-row class="mt-1">
      <v-col cols="12">
        <v-card-title class="text-h4 text-center">
          {{ formatTime(currentTime) }}
        </v-card-title>
      </v-col>

      <v-col>
        <v-card-actions class="justify-center">
          <v-btn
            v-if="!isRunning"
            icon="mdi-play-circle"
            size="x-large"
            variant="text"
            :disabled="workDuration <= 0"
            @click="startTimer()"
          >
          </v-btn>
          <v-btn
            v-else
            icon="mdi-stop-circle"
            variant="text"
            size="x-large"
            @click="stopTimer"
          >
          </v-btn>
        </v-card-actions>
      </v-col>
    </v-row>

    <v-row class="mb-1">
      <v-col>
        <v-text-field
          label="Insira um valor diferente"
          clearable
          v-model="workDuration"
          persistent-hint
          variant="outlined"
          class="pl-4 pr-4"
          max-width="50"
          @input="handleInput"
          :rules="[positiveNumberRule]"
        >
          <template v-slot:append-inner>
            <v-tooltip location="bottom">
              <template v-slot:activator="{ props }">
                <v-icon v-bind="props" icon="mdi-help-circle-outline"></v-icon>
              </template>
              Tempo de Trabalho (minutos)
            </v-tooltip>
          </template>
        </v-text-field>
      </v-col>
    </v-row>
  </v-card>
</template>
