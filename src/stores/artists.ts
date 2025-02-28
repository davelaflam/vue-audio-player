import { ref } from 'vue'
import { defineStore } from 'pinia'

import MillerLaneAlbumCover from '@/assets/images/music/miller-lane--family-tree.jpg'

export interface Track {
  title: string
  artist: string
  howl: null | Howl
  display: boolean
}

export interface Album {
  title: string
  year: string
  cover: string
  tracks: Track[]
}

export interface Artist {
  id: number
  artist: string
  imageUrl: string
  isActive: boolean
  createdAt: string
  createdBy: string
  deletedAt: string | null
  deletedBy: string | null
  updatedAt: string
  updatedBy: string | null
  albums: Album[]
  bandMembers: string[]
  audioPath: string
}

interface ArtistState {
  artists: Artist[]
  artist?: Artist
  errors: Record<string, string | null>
  loading: Record<string, boolean>
  globalSelectedTrack: Track | null
}

const millerLanePlayList = ref([
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
        ],
        bandMembers: [
          'Stephan Roy - Vocals',
          'Brian Gunter - Guitar, Cello',
          'Dave LaFlam - Electric/Upright Bass',
          'James Beasley - Drums',
        ],
        audioPath: 'miller-lane',
      },
    ],
    artist: undefined,
    loading: {},
    errors: {},
    globalSelectedTrack: null, // New global selected track state
  }),

  actions: {
    // New action to set the global selected track
    setGlobalSelectedTrack(track: Track) {
      this.globalSelectedTrack = track
    },
  },
})
