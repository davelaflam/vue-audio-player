<template>
  <div class="player">
    <player-title-bar
      :playlist="playlist"
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
      @playtrack="play"
      @pausetrack="pause"
      @stoptrack="stop"
      @skiptrack="skip"
      @toggleloop="toggleLoop"
      @toggleshuffle="toggleShuffle"
      @updateseek="setSeek"
    />
    <player-playlist-panel
      :playlist="playlist"
      :selected-track="selectedTrack"
      @selecttrack="selectTrack"
      @playtrack="play"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, onMounted, type PropType } from 'vue'
import { Howl } from 'howler'
import type { Track } from '@/components/player/types/Track'
import { useArtistsStore } from '@/stores/artists'

import PlayerTitleBar from '@/components/player/PlayerTitleBar.vue'
import PlayerInfoPanel from '@/components/player/PlayerInfoPanel.vue'
import PlayerControlsBars from '@/components/player/PlayerControlsBars.vue'
import PlayerPlaylistPanel from '@/components/player/PlayerPlaylistPanel.vue'

let globalActivePlayer: Howl | null = null

export default defineComponent({
  components: {
    PlayerTitleBar,
    PlayerInfoPanel,
    PlayerControlsBars,
    PlayerPlaylistPanel,
  },
  props: {
    // 🎵 Music-related props
    playlist: {
      type: Array as PropType<Track[]>,
      required: true,
    },
    audioPath: {
      type: String,
      default: './assets/music',
    },

    // 🎨 Album details
    albumCoverPath: {
      type: String,
      required: true,
    },
    albumTitle: {
      type: String,
      required: true,
    },
    albumYear: {
      type: String,
      required: true,
    },

    // 🎤 Artist details
    artist: {
      type: String,
      required: true,
    },
    bandMembers: {
      type: Array as PropType<string[]>,
      required: true,
    },
  },
  setup(props) {
    const artistsStore = useArtistsStore()
    const selectedTrack = ref<Track | null>(null)
    const index = ref(0)
    const playing = ref(false)
    const loop = ref(false)
    const shuffle = ref(false)
    const seek = ref(0)

    const currentTrack = computed(() => props.playlist[index.value])
    const progress = computed(() =>
      currentTrack.value.howl ? (seek.value / currentTrack.value.howl.duration()) * 100 : 0,
    )

    const getTrackInfo = computed(() => ({
      artist: currentTrack.value.artist,
      title: currentTrack.value.title,
      seek: seek.value,
      duration: currentTrack.value.howl ? currentTrack.value.howl.duration() : 0,
    }))

    let updateSeekInterval: number | undefined

    watch(playing, (newPlaying) => {
      if (newPlaying && currentTrack.value.howl) {
        updateSeekInterval = window.setInterval(() => {
          seek.value = currentTrack.value.howl!.seek() as number
        }, 250)
      } else if (updateSeekInterval) {
        clearInterval(updateSeekInterval)
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

    function selectTrack(track: Track) {
      selectedTrack.value = track
      const trackIndex = props.playlist.findIndex((t) => t === track)
      index.value = trackIndex
      artistsStore.setGlobalSelectedTrack(track)
      play(trackIndex)
    }

    function play(idx?: number) {
      if (globalActivePlayer && globalActivePlayer.playing()) {
        globalActivePlayer.stop()
      }

      index.value = idx !== undefined ? idx : index.value
      selectedTrack.value = props.playlist[index.value]
      artistsStore.setGlobalSelectedTrack(selectedTrack.value)
      const track = selectedTrack.value.howl!
      track.play()
      globalActivePlayer = track
      playing.value = true
    }

    function pause() {
      currentTrack.value.howl?.pause()
      playing.value = false
    }

    function stop() {
      currentTrack.value.howl?.stop()
      playing.value = false

      if (globalActivePlayer === currentTrack.value.howl) {
        globalActivePlayer = null
      }
    }

    function skip(direction: 'next' | 'prev') {
      if (currentTrack.value.howl?.playing()) currentTrack.value.howl.stop()

      if (shuffle.value) {
        let newIndex = Math.floor(Math.random() * props.playlist.length)
        while (newIndex === index.value)
          newIndex = Math.floor(Math.random() * props.playlist.length)
        index.value = newIndex
      } else {
        index.value =
          direction === 'next'
            ? (index.value + 1) % props.playlist.length
            : (index.value - 1 + props.playlist.length) % props.playlist.length
      }

      play(index.value)
      artistsStore.setGlobalSelectedTrack(props.playlist[index.value])
    }

    function toggleLoop(value: boolean) {
      loop.value = value
    }

    function toggleShuffle(value: boolean) {
      shuffle.value = value
    }

    function setSeek(percents: number) {
      currentTrack.value.howl?.seek((currentTrack.value.howl.duration() * percents) / 100)
    }

    return {
      selectedTrack,
      playing,
      loop,
      shuffle,
      seek,
      currentTrack,
      progress,
      getTrackInfo,
      selectTrack,
      play,
      pause,
      stop,
      skip,
      toggleLoop,
      toggleShuffle,
      setSeek,
    }
  },
})
</script>

<style scoped lang="scss">
.player {
  background: #3b3b3b;
  border-radius: 8px;
  padding: 10px;
  color: #fff;
}
</style>
