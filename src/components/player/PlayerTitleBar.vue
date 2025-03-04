<template>
  <v-card class="">
    <v-card-item density="compact">
      <div class="player-title-bar d-flex flex-column flex-md-row align-md-center justify-md-space-between">
        <v-card-title class="d-flex align-center">
          <img class="album-cover" :src="albumCoverPath" alt="Album Cover" />

          <div class="d-flex flex-column text-left text-md-start">
            <div class="d-flex flex-row">
              <b class="album-artist">{{ albumArtist }}</b>
              <span class="album-title"> <span v-if="albumTitle" class="ml-2 mr-1">-</span> {{ albumTitle }} </span>
            </div>

            <ul class="band-members mt-1">
              <li v-for="(member, index) in bandMembers" :key="index">{{ member }}</li>
            </ul>
          </div>
        </v-card-title>

        <v-card-subtitle class="album-year">
          {{ albumYear }}
        </v-card-subtitle>
      </div>
    </v-card-item>
  </v-card>
</template>

<script lang="ts" setup>
import type { PlayerTitleBarProps } from '@/types'

defineProps<PlayerTitleBarProps>()
</script>

<style scoped lang="scss">
.music-catalog {
  .player-title-bar {
    width: 100%;
  }

  .album-cover {
    height: 150px;
    min-height: 150px;
    min-width: 150px;
    margin-right: 10px;
    width: 150px;
  }

  .album-artist {
    color: rgb(var(--v-theme-primary)) !important;
  }

  .band-members {
    font-size: 14px;
    list-style: none;
    text-wrap: auto;
  }

  @media (max-width: 959px) {
    .album-year {
      margin-top: 10px;
    }
  }

  @media (max-width: 650px) {
    .album-cover {
      height: 100px;
      min-height: 100px;
      min-width: 100px;
      margin-right: 10px;
      width: 100px;
    }

    .album-artist,
    .album-title {
      font-size: 13px;
    }

    .band-members {
      font-size: 12px;
    }
  }
}
</style>
