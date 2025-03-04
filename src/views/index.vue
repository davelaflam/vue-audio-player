<script lang="ts" setup>
import { onMounted, ref } from 'vue'

import { useArtistsStore } from '@/stores/artists'
import Player from '@/components/player/Player.vue'

const artistsStore = useArtistsStore()
const { artists } = artistsStore
const isMobile = ref(false)
const isMobileView = () => window.innerWidth <= 650 // Adjust the breakpoint as needed

onMounted(() => {
  // Check the initial screen size on component mount
  isMobile.value = isMobileView()

  // Listen for window resize to update the view
  window.addEventListener('resize', () => {
    isMobile.value = isMobileView()
  })
})
</script>

<template>
  <section class="music-catalog">
    <v-container>
      <v-timeline density="compact" side="end">
        <v-timeline-item v-for="(item, index) in artists" :key="index">
          <template #icon>
            <v-avatar :image="item.albums[0].cover"></v-avatar>
          </template>
          <Player
            :playlist="item.albums[0].tracks"
            :audio-path="item.audioPath"
            :album-cover-path="item.albums[0].cover"
            :artist="item.artist"
            :album-title="item.albums[0].title"
            :album-year="item.albums[0].year"
            :band-members="item.bandMembers"
          />
        </v-timeline-item>
      </v-timeline>
    </v-container>
  </section>
</template>

<style scoped lang="scss">
@media (min-width: 441px) and (max-width: 490px) {
  .player {
    width: 360px;
  }
}

@media (max-width: 400px) {
  .v-card {
    width: auto;
  }
}
</style>

<style lang="scss">
.music-catalog {
  .v-timeline-item {
    width: auto;
  }

  .v-timeline-item__body {
    width: 100%;
  }

  .v-timeline-item__body .v-card-item,
  .v-timeline-item__body .v-card {
    background: none;
    border-radius: 0 !important;
  }

  @media (max-width: 475px) {
    .v-timeline-divider {
      display: none;
    }
  }

  @media (max-width: 440px) {
    .v-timeline--vertical.v-timeline.v-timeline--side-end .v-timeline-item .v-timeline-item__body {
      padding-left: 0;
    }
  }
}
</style>
