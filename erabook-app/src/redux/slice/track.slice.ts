import { Track } from "@hooks/useTrackPlayer";
import { SliceName } from "@redux/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";


interface TrackState {
    track?: Track;
    loading: boolean;
    error: string | null;
    isPlaying: boolean;
    isReady: boolean;
    isBuffering: boolean;
    position: number;
    duration: number;
    isSetup: boolean;
    bottomSheetVisible: boolean;
    currentEBook?: IBook
}

const initialState: TrackState = {
    track: undefined,
    loading: false,
    error: null,
    isPlaying: false,
    isReady: false,
    isBuffering: false,
    position: 0,
    duration: 0,
    isSetup: false,
    bottomSheetVisible: false
}

const trackSlice = createSlice({
    name: SliceName.Track,
    initialState,
    reducers: {
        setTrack(state, action: PayloadAction<Track | undefined>) {
            state.track = action.payload;
        },
        removeTrack(state) {
            state.track = undefined;
        },
        setIsPlaying(state, action: PayloadAction<boolean>) {
            state.isPlaying = action.payload;
        },
        setIsReady(state, action: PayloadAction<boolean>) {
            state.isReady = action.payload;
        },
        setIsBuffering(state, action: PayloadAction<boolean>) {
            state.isBuffering = action.payload;
        },
        setPosition(state, action: PayloadAction<number>) {
            state.position = action.payload;
        },
        setDuration(state, action: PayloadAction<number>) {
            state.duration = action.payload;
        },
        setIsSetup(state, action: PayloadAction<boolean>) {
            state.isSetup = action.payload;
        },
        toggleBottomSheet(state, action: PayloadAction<boolean>) {
            state.bottomSheetVisible = action.payload;
        },
        setCurrentBook(state, action: PayloadAction<IBook>) {
            state.currentEBook = action.payload;
        }
    }
})


export const {
    setTrack,
    removeTrack,
    setDuration,
    setPosition,
    setIsBuffering,
    setIsPlaying,
    setIsReady,
    setIsSetup,
    toggleBottomSheet,
    setCurrentBook
} = trackSlice.actions;
export default trackSlice.reducer;