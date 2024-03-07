/**
 * @format
 */
import { AppRegistry } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
import { MMKV } from "react-native-mmkv";
import TrackPlayer from "react-native-track-player";
import { playbackService } from "@services/track.player.service";

import "./src/translations/index";
AppRegistry.registerComponent(appName, () => App);
TrackPlayer.registerPlaybackService(() => playbackService);
