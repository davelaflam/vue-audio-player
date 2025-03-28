<template>
  <v-card height="330" class="player-playlist-panel">
    <v-list>
      <v-list-item
        v-for="(track, index) in playlist"
        :key="track.title"
        v-show="track.display"
        :class="[{ selected: track === artistsStore.globalSelectedTrack }, { even: index % 2 === 0 }]"
        @click="selectTrack(track)"
        @dblclick.prevent
      >
        <v-list-item-title v-if="track" class="track-info">
          <span class="track-title"> {{ index + 1 }}. {{ track.title }} </span>
          <span class="track-duration">{{ formatTime(track.howl?.duration() ?? 0) }}</span>
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script lang="ts" setup>
import { useArtistsStore } from '@/stores/artists'
import type { PlayerPlaylistPanelProps, Track } from '@/types'

const props = defineProps<PlayerPlaylistPanelProps>()

const artistsStore = useArtistsStore()

const selectTrack = (track: Track) => {
  if (artistsStore.globalSelectedTrack !== track) {
    artistsStore.setGlobalSelectedTrack(track)
    props.selectTrack(track) // ✅ Call the function from props
  }
}

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0')
  return `${minutes}:${remainingSeconds}`
}
</script>

<style scoped lang="scss">
.v-card.player-playlist-panel {
  border-bottom-left-radius: 8px !important;
  border-bottom-right-radius: 8px !important;
}

.selected {
  background-color: #2196f3 !important;
}

.even {
  background-color: #505050;
}

.playlist {
  overflow: auto;
}

.track-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.track-title {
  flex: 1;
}

.track-duration {
  margin-left: auto;
  text-align: right;
}
</style>
