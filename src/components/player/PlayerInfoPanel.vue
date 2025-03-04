<template>
  <v-card height="" class="">
    <v-card-title class="d-flex justify-space-between align-center">
      <h2 class="track-info-title"><!--{{ trackInfo.artist }} - -->{{ trackInfo.title }}</h2>
      <h3 class="track-info-seek-duration">{{ formatTime(trackInfo.seek) }} / {{ formatTime(trackInfo.duration) }}</h3>
    </v-card-title>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import type { TrackInfo } from '@/types'

export default defineComponent({
  props: {
    trackInfo: {
      type: Object as PropType<TrackInfo>,
      required: true,
    },
    albumCoverPath: {
      type: String,
      required: true,
    },
  },
  setup() {
    const formatTime = (seconds: number) => {
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = Math.floor(seconds % 60)
        .toString()
        .padStart(2, '0')
      return `${minutes}:${remainingSeconds}`
    }

    return {
      formatTime,
    }
  },
})
</script>

<style scoped lang="scss">
.track-info-title,
.track-info-seek-duration {
  font-size: 20px;
}

@media (max-width: 600px) {
  .track-info-title,
  .track-info-seek-duration {
    font-size: 16px;
  }

  .track-info-seek-duration {
    justify-content: space-between;
  }
}
</style>
