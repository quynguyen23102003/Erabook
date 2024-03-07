
import { numberHelper } from 'helper/string.helper';
import TrackPlayer, {
    AppKilledPlaybackBehavior,
    Capability,
    RepeatMode,
} from 'react-native-track-player';


export async function setupPlayer() {
    let isSetup = false;
    try {
        await TrackPlayer.getCurrentTrack();
        isSetup = true;
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

        isSetup = true;
    }
    finally {
        return isSetup;
    }
}

export async function addTracks() {
    await TrackPlayer.add([
        {
            id: '1',
            url: require('../assets/audio/test01.mp3'),
            title: 'Test01',
            artist: 'Test01',
            duration: 60,
        }
    ]);
    await TrackPlayer.setRepeatMode(RepeatMode.Queue);
}

export async function playbackService() {
    // TODO: Attach remote event handlers
}

export const getAudioFiles = (id: string, title: string, addSubTitle: boolean = false) => {
    const data: AudioFile[] = [];
    for (let index = 0; index < 34; index++) {
        const url =
            "https://s1.phatphapungdung.com/media/bookspeak/sach-noi-new/van-hoc-thieu-nhi-phat-phap-ung-dung/Tuoi-Tho-Du-Doi-"
            + numberHelper(index + 1) +
            "-phatphapungdung.com.mp3"
        data.push({
            id: id + "_audio_" + index.toString(),
            url: url,
            title: addSubTitle ? title + " " + numberHelper(index + 1) : title,
        })
    }
    return data;
}