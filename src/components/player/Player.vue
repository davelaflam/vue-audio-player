<template>
  <div class="player">
    <player-title-bar
      :album-cover-path="albumCoverPath"
      :album-artist="artist"
      :album-title="albumTitle"
      :album-year="albumYear"
      :band-members="bandMembers"
      :selected-track="selectedTrack"
      @selecttrack="selectTrack"
      @playtrack="play"
    />
    <player-info-panel :track-info="getTrackInfo" :album-cover-path="albumCoverPath" />
    <player-controls-bars
      :loop="loop"
      :shuffle="shuffle"
      :progress="progress"
      :playTrack="play"
      :pauseTrack="pause"
      :stopTrack="stop"
      :skipTrack="skip"
      :toggleLoop="toggleLoop"
      :toggleShuffle="toggleShuffle"
      :updateSeek="setSeek"
    />
    <player-playlist-panel
      :playlist="playlist"
      :selected-track="selectedTrack"
      :selectTrack="selectTrack"
      :playTrack="play"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { Howl } from 'howler'
import { useArtistsStore } from '@/stores/artists'
import type { PlayerProps } from '@/types/Player'
import type { Track, TrackInfo } from '@/types'

import PlayerTitleBar from '@/components/player/PlayerTitleBar.vue'
import PlayerInfoPanel from '@/components/player/PlayerInfoPanel.vue'
import PlayerControlsBars from '@/components/player/PlayerControlsBars.vue'
import PlayerPlaylistPanel from '@/components/player/PlayerPlaylistPanel.vue'

const props = defineProps<PlayerProps>()

const artistsStore = useArtistsStore()
const selectedTrack = ref<Track | null>(null)
const index = ref(0)
const playing = ref(false)
const loop = ref(false)
const shuffle = ref(false)
const seek = ref(0)

let globalActivePlayer: Howl | null = null
let updateSeekInterval: number | null = null

const currentTrack = computed(() => props.playlist[index.value] ?? null)

const progress = computed(() =>
  currentTrack.value?.howl ? (seek.value / currentTrack.value.howl.duration()) * 100 : 0,
)

const getTrackInfo = computed<TrackInfo>(() => ({
  artist: currentTrack.value?.artist || '',
  title: currentTrack.value?.title || '',
  seek: seek.value,
  duration: currentTrack.value?.howl ? currentTrack.value.howl.duration() : 0,
}))

watch(playing, (newPlaying) => {
  if (newPlaying && currentTrack.value?.howl) {
    updateSeekInterval = window.setInterval(() => {
      seek.value = currentTrack.value!.howl!.seek() as number
    }, 250)
  } else if (updateSeekInterval) {
    clearInterval(updateSeekInterval)
    updateSeekInterval = null
  }
})

onMounted(() => {
  props.playlist.forEach((track) => {
    const file = track.title.replace(/\s/g, '_')
    track.howl = new Howl({
      src: [`/music/${props.audioPath}/${file}.mp3`],
      html5: true,
      onend: () => {
        if (loop.value) {
          play(index.value)
        } else {
          skip('next')
        }
      },
    })
  })
})

onUnmounted(() => {
  if (updateSeekInterval) {
    clearInterval(updateSeekInterval)
  }
})

const selectTrack = (track: Track) => {
  selectedTrack.value = track
  const trackIndex = props.playlist.findIndex((t) => t === track)
  index.value = trackIndex
  artistsStore.setGlobalSelectedTrack(track)
  play(trackIndex)
}

const play = (idx?: number | Event) => {
  // ✅ Ensure `idx` is a number, not an event
  if (idx instanceof Event) {
    idx = index.value // Use the last valid track index
  }

  if (!props.playlist.length) {
    console.error('No tracks available to play.')
    return
  }

  const newIndex = idx !== undefined ? idx : index.value

  if (!props.playlist[newIndex]) {
    console.error(`Invalid track index: ${newIndex}`)
    return
  }

  // Stop previous track before switching
  if (globalActivePlayer && globalActivePlayer !== props.playlist[newIndex].howl) {
    globalActivePlayer.stop()
  }

  index.value = newIndex
  selectedTrack.value = props.playlist[newIndex]
  artistsStore.setGlobalSelectedTrack(selectedTrack.value)

  const track = selectedTrack.value.howl
  if (track) {
    track.loop(loop.value)
    track.play()
    globalActivePlayer = track
    playing.value = true
  } else {
    console.error('Howl instance is missing for track:', selectedTrack.value.title)
  }
}

const pause = () => {
  if (currentTrack.value?.howl) {
    currentTrack.value.howl.pause()
    playing.value = false
  }
}

const stop = () => {
  if (currentTrack.value?.howl) {
    currentTrack.value.howl.stop()
    playing.value = false
    if (globalActivePlayer === currentTrack.value.howl) {
      globalActivePlayer = null
    }
  }
}

const skip = (direction: 'next' | 'prev') => {
  if (!props.playlist.length) return

  let newIndex = index.value
  if (shuffle.value) {
    newIndex = Math.floor(Math.random() * props.playlist.length)
    while (newIndex === index.value) {
      newIndex = Math.floor(Math.random() * props.playlist.length)
    }
  } else {
    newIndex =
      direction === 'next'
        ? (index.value + 1) % props.playlist.length
        : (index.value - 1 + props.playlist.length) % props.playlist.length
  }

  play(newIndex)
}

const toggleLoop = (value: boolean) => {
  console.log('Toggle loop:', value)
  loop.value = value
  if (value) {
    shuffle.value = false
  }
}

const toggleShuffle = (value: boolean) => {
  console.log('Toggle shuffle:', value)
  shuffle.value = value
  if (value) {
    loop.value = false
    stop()
    shuffleAndPlayNewTrack()
  }
}

const shuffleAndPlayNewTrack = () => {
  if (!props.playlist.length) return

  let newIndex = Math.floor(Math.random() * props.playlist.length)

  while (newIndex === index.value) {
    newIndex = Math.floor(Math.random() * props.playlist.length)
  }

  play(newIndex)
}

const setSeek = (percents: number) => {
  if (currentTrack.value?.howl) {
    const newSeek = (currentTrack.value.howl.duration() * percents) / 100
    currentTrack.value.howl.seek(newSeek)
  }
}
</script>

<style scoped lang="scss">
.player {
  background: #3b3b3b;
  border-radius: 8px;
  padding: 10px;
  color: #fff;
}
</style>
