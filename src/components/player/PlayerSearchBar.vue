<template>
  <v-toolbar flat>
    <v-text-field
      v-model="searchString"
      clearable
      prepend-icon="mdi-magnify"
      placeholder="Quick search"
      @input="searchPlaylist"
    />
    <v-spacer></v-spacer>
  </v-toolbar>
</template>

<script lang="ts">
import { Howl } from 'howler'
import { defineComponent, ref, watch, type PropType } from 'vue'

interface Track {
  title: string
  artist: string
  howl: Howl | null
  display: boolean
}

export default defineComponent({
  props: {
    playlist: {
      type: Array as PropType<Track[]>,
      required: true,
    },
  },
  setup(props) {
    const searchString = ref('')

    const searchPlaylist = () => {
      props.playlist.forEach((track) => {
        const searchLower = searchString.value.toLowerCase()
        const titleMatch = track.title.toLowerCase().includes(searchLower)
        const artistMatch = track.artist.toLowerCase().includes(searchLower)
        track.display = searchLower === '' || titleMatch || artistMatch
      })
    }

    watch(searchString, searchPlaylist)

    return {
      searchString,
      searchPlaylist,
    }
  },
})
</script>
