import { setDuration, setIsBuffering, setIsPlaying, setIsReady, setIsSetup, setPosition, setTrack } from "@redux/slice/track.slice";
import { useAppDispatch, useAppSelector } from "@redux/storeAndStorage/persist";
import { useState } from "react";
import TrackPlayer, { AddTrack, AppKilledPlaybackBehavior, Capability } from "react-native-track-player";

export interface Track {
    id: string;
    url: string;
    title: string;
    artist: string;
    duration: number;
}

export enum TrackPlayerEvents {
    STATE_PLAYING = 'STATE_PLAYING',
    STATE_PAUSED = 'STATE_PAUSED',
    STATE_STOPPED = 'STATE_STOPPED',
    STATE_BUFFERING = 'STATE_BUFFERING',
    STATE_READY = 'STATE_READY',
}

export const useTrackPlayer = () => {
    const {
        duration,
        position,
        isBuffering,
        isReady,
        isPlaying,
        track,
        isSetup,
    } = useAppSelector(state => state.root.track);

    const dispatch = useAppDispatch();

    const setupPlayer = async () => {
        try {
            await TrackPlayer.getCurrentTrack();
            setIsSetup(true);
        }
        catch {
            await TrackPlayer.setupPlayer();
            await TrackPlayer.updateOptions({
                android: {
                    appKilledPlaybackBehavior:
                        AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
                },
                capabilities: [
                    Capability.Play,
                    Capability.Pause,
                    Capability.SkipToNext,
                    Capability.SkipToPrevious,
                    Capability.SeekTo,
                ],
                compactCapabilities: [
                    Capability.Play,
                    Capability.Pause,
                    Capability.SkipToNext,
                ],
                progressUpdateEventInterval: 2,
            });
            dispatch(setIsSetup(true));
        }
    }

    const addTrack = async (track: Track) => {
        await TrackPlayer.add(track)
        dispatch(setTrack(track));
        dispatch(setIsPlaying(false));
    }

    const onTrackChange = (newTrack?: Track) => {
        dispatch(setTrack(newTrack));
        dispatch(setIsPlaying(false));
        dispatch(setPosition(0));
        dispatch(setDuration(0));
    }

    const onPlaybackTrackChanged = (data: { position: number, duration: number }) => {
        setIsPlaying(true);
        dispatch(setPosition(data.position));
        dispatch(setDuration(data.duration));
    }

    const onPlaybackQueueEnded = (index: number) => {
        dispatch(setIsPlaying(false));
        TrackPlayer.skip(index);
    }

    const onPlaybackError = (error: any) => {
        dispatch(setIsPlaying(false));
        console.log('error', error);
    }

    const togglePlayback = async () => {
        const currentTrack = await TrackPlayer.getCurrentTrack();
        if (currentTrack != null) {
            if (isPlaying) {
                await TrackPlayer.pause();
                dispatch(setIsPlaying(false));
            } else {
                await TrackPlayer.play();
                dispatch(setIsPlaying(true));
            }
        } else {
            await TrackPlayer.reset();

        }
    }

    const skipToNext = async () => {
        try {
            dispatch(setIsPlaying(true));
            await TrackPlayer.skipToNext();
        } catch (_) { }
    }

    const skipToPrevious = async () => {
        try {
            dispatch(setIsPlaying(true));
            await TrackPlayer.skipToPrevious();
        } catch (_) { }
    }

    const seekTo = async (amount: number) => {
        try {
            dispatch(setIsPlaying(true));
            await TrackPlayer.seekTo(amount);
        } catch (_) { }
    }

    const stop = async () => {
        try {
            await TrackPlayer.stop();
            dispatch(setIsPlaying(false));
            dispatch(setTrack())
        } catch (_) { }
    }

    const onPlaybackStateChange = (state: TrackPlayerEvents) => {
        dispatch(setIsPlaying(state === TrackPlayerEvents.STATE_PLAYING));
        dispatch(setIsBuffering(state === TrackPlayerEvents.STATE_BUFFERING));
        dispatch(setIsReady(state === TrackPlayerEvents.STATE_READY));
    }

    const onClear = async () => {
        await TrackPlayer.reset();
        dispatch(setTrack());
        dispatch(setIsPlaying(false));
        dispatch(setPosition(0));
        dispatch(setDuration(0));
    }

    const play = async () => {
        await TrackPlayer.play();
        dispatch(setIsPlaying(true));
    }

    const pause = async () => {
        await TrackPlayer.pause();
        dispatch(setIsPlaying(false));
    }

    const thisBook = (id: string) => {
        return track?.id === id;
    }

    const currentProgress = async () => {
        return await TrackPlayer.getProgress();
    }

    return {
        onTrackChange,
        onPlaybackTrackChanged,
        onPlaybackQueueEnded,
        onPlaybackError,
        togglePlayback,
        skipToNext,
        skipToPrevious,
        seekTo,
        play,
        pause,
        stop,
        onPlaybackStateChange,
        addTrack,
        setupPlayer,
        onClear,
        thisBook,
        currentProgress
    }
}