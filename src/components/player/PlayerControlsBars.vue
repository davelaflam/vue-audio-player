<template>
  <div class="player-controls-bars-container">
    <!-- Volume Controls -->
    <div class="volume-controls">
      <v-chip icon @click="toggleMute">
        <template v-if="!muted">
          <v-icon v-if="volume >= 0.5">mdi-volume-high</v-icon>
          <v-icon v-else-if="volume > 0">mdi-volume-medium</v-icon>
          <v-icon v-else>mdi-volume-mute</v-icon>
        </template>
        <v-icon v-show="muted">mdi-volume-off</v-icon>
      </v-chip>
      <v-slider v-model="volume" max="1" step="0.01" class="volume-slider"></v-slider>
      <span class="volume-percentage">{{ (volume * 100).toFixed(0) }}%</span>
    </div>

    <!-- Player Controls -->
    <div class="player-controls">
      <v-chip icon class="control-btn" color="light-blue" @click="emitSkipTrack('prev')">
        <v-icon>mdi-skip-previous</v-icon>
      </v-chip>
      <v-chip icon class="control-btn" color="light-blue" @click="emitStopTrack">
        <v-icon>mdi-stop</v-icon>
      </v-chip>
      <v-chip icon class="control-btn play-btn" color="light-blue" @click="emitPlayTrack">
        <v-icon>mdi-play</v-icon>
      </v-chip>
      <v-chip icon class="control-btn" color="light-blue" @click="emitPauseTrack">
        <v-icon>mdi-pause</v-icon>
      </v-chip>
      <v-chip icon class="control-btn" color="light-blue" @click="emitSkipTrack('next')">
        <v-icon>mdi-skip-next</v-icon>
      </v-chip>
    </div>

    <!-- Loop and Shuffle Controls -->
    <div class="loop-shuffle-controls">
      <v-chip icon @click="emitToggleLoop">
        <v-icon :color="loop ? 'light-blue' : 'blue-grey'">mdi-repeat-once</v-icon>
      </v-chip>
      <v-chip icon @click="emitToggleShuffle">
        <v-icon :color="shuffle ? 'light-blue' : 'blue-grey'">mdi-shuffle</v-icon>
      </v-chip>
    </div>
  </div>

  <v-progress-linear
    v-model="trackProgress"
    height="10"
    class="progress-bar"
    @click="updateSeek($event)"
  ></v-progress-linear>
</template>

<script lang="ts">
import { defineComponent, ref, computed, type PropType, watch } from 'vue'
import { Howler } from 'howler'

export default defineComponent({
  props: {
    loop: Boolean,
    shuffle: Boolean,
    progress: Number as PropType<number>,
  },
  setup(props, { emit }) {
    const volume = ref(0.2)
    const muted = ref(false)

    const trackProgress = computed(() => props.progress)

    watch(volume, (newVolume) => {
      Howler.volume(newVolume)
      if (newVolume > 0) {
        muted.value = false
        Howler.mute(false)
      }
    })

    const toggleMute = () => {
      muted.value = !muted.value
      Howler.mute(muted.value)
    }

    const emitPlayTrack = () => emit('playtrack')
    const emitPauseTrack = () => emit('pausetrack')
    const emitStopTrack = () => emit('stoptrack')
    const emitSkipTrack = (direction: 'next' | 'prev') => emit('skiptrack', direction)
    const emitToggleLoop = () => emit('toggleloop', !props.loop)
    const emitToggleShuffle = () => emit('toggleshuffle', !props.shuffle)

    const updateSeek = (event: MouseEvent) => {
      const el = (event.target as HTMLElement).closest('.v-progress-linear') as HTMLElement
      const mousePos = event.offsetX
      const elWidth = el.clientWidth
      const percents = (mousePos / elWidth) * 100
      emit('updateseek', percents)
    }

    return {
      volume,
      muted,
      trackProgress,
      toggleMute,
      emitPlayTrack,
      emitPauseTrack,
      emitStopTrack,
      emitSkipTrack,
      emitToggleLoop,
      emitToggleShuffle,
      updateSeek,
    }
  },
})
</script>

<style scoped lang="scss">
.player-controls-bars-container {
  background: rgb(18, 18, 18);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  flex-wrap: nowrap;
}

.volume-controls {
  display: flex;
  align-items: center;
  gap: 0;
  flex-shrink: 0;
}

.volume-slider {
  width: 150px;
}

.volume-percentage {
  min-width: 40px;
  text-align: right;
}

.player-controls {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: center;
  flex-grow: 1;
}

.loop-shuffle-controls {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.control-btn {
  border-radius: 50%;
  border: 2px solid #2196f3;
  width: 38px !important;
  height: 38px !important;
  display: flex;
  align-items: center;
  justify-content: center;
}

.play-btn {
  font-size: 30px;
  width: 54px !important;
  height: 54px !important;
  border: 2px solid #2196f3;

  .mdi:before {
    font-size: 40px;
  }
}

.progress-bar {
  margin-top: 0;
}

@media (max-width: 767px) {
  .player-controls-bars-container {
    flex-direction: column;
    gap: 15px;
  }

  .player-controls {
    flex-grow: 0;
  }
}

@media (max-width: 440px) {
  .v-timeline-divider {
    display: none !important;
  }
}
</style>

<style lang="scss">
.player-controls-bars-container {
  .v-input__details {
    display: none;
  }
}

.progress-bar {
  .v-progress-linear__determinate,
  .v-progress-linear__indeterminate {
    background: #30b2c5;
  }
}

@media (max-width: 475px) {
  .v-timeline-item {
    padding: 0 !important;
  }
  .v-timeline-divider {
    display: none !important;
  }
}
</style>
