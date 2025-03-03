import { ref } from 'vue'
import { defineStore } from 'pinia'

import type { Track, ArtistState, Album, Artist } from '@/types'
import MillerLaneAlbumCover from '@/assets/images/music/miller-lane--family-tree.jpg'

const millerLanePlayList = ref<Track[]>([
  { title: 'Family Tree', artist: 'Miller Lane', howl: null, display: true },
  { title: 'Better Days', artist: 'Miller Lane', howl: null, display: true },
  { title: 'Collide', artist: 'Miller Lane', howl: null, display: true },
  { title: 'Dissolve', artist: 'Miller Lane', howl: null, display: true },
  { title: 'Loveless', artist: 'Miller Lane', howl: null, display: true },
  { title: 'Yesterday', artist: 'Miller Lane', howl: null, display: true },
])

export const useArtistsStore = defineStore('artists', {
  state: (): ArtistState => ({
    artists: [
      {
        id: 1,
        artist: 'Miller Lane',
        imageUrl: 'path/to/miller-lane-image.jpg',
        isActive: true,
        createdAt: '2023-01-01T00:00:00Z',
        createdBy: 'admin',
        deletedAt: null,
        deletedBy: null,
        updatedAt: '2023-01-01T00:00:00Z',
        updatedBy: 'admin',
        albums: [
          {
            title: 'Family Tree',
            year: 'Seattle, WA / circa 2001-2002',
            cover: MillerLaneAlbumCover,
            tracks: millerLanePlayList.value,
          },
        ] as Album[],
        bandMembers: [
          'Stephan Roy - Vocals',
          'Brian Gunter - Guitar, Cello',
          'Dave LaFlam - Electric/Upright Bass',
          'James Beasley - Drums',
        ],
        audioPath: 'miller-lane',
      } as Artist,
    ],
    artist: undefined,
    loading: {},
    errors: {},
    globalSelectedTrack: null,
  }),

  actions: {
    setGlobalSelectedTrack(track: Track) {
      this.globalSelectedTrack = track
    },
  },
})
