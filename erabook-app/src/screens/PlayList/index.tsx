import { useAppTheme } from "@themes/theme.config";
import { Dimensions, Pressable, TextInput, TouchableOpacity, View, Text } from "react-native"
import { useStyles } from "./styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppDispatch, useAppSelector } from "@redux/storeAndStorage/persist";
import { Track, useTrackPlayer } from "@hooks/useTrackPlayer";
import { setIsLoading } from "@redux/slice/app.slice";
import { AppHeader } from "@components/AppHeader";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faBackward, faChevronLeft, faCompactDisc, faFloppyDisk, faForward, faPause, faPlay, faStop } from "@fortawesome/free-solid-svg-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import FastImage from 'react-native-fast-image'
import { View as MotiView } from "moti";
import { getAudioFiles } from "@services/track.player.service";
import { RootStackName, RootStackParamList } from "@navigator/types";
import { useCallback, useEffect, useMemo, useState } from "react";
import CustomBottomSheet from "@components/bottomsheet";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { ScrollView } from "react-native-gesture-handler";


const { width, height } = Dimensions.get('screen');

export const PlayAudioScreen = () => {
    const { colors } = useAppTheme();
    const styles = useStyles(colors);
    const { top } = useSafeAreaInsets();
    const dispatch = useAppDispatch();
    const navigation = useNavigation();
    const {
        currentEBook,
        track,
        isPlaying,
    } = useAppSelector(state => state.root.track);
    const {
        addTrack,
        play,
        onClear,
        pause,
        currentProgress
    } = useTrackPlayer();
    const { params } = useRoute<RouteProp<RootStackParamList, RootStackName.PlayAudioScreen>>();
    const [visible, setVisible] = useState(false);
    const [index, setIndex] = useState(params.index ?? 0);
    const data: AudioFile[] = useMemo(() => {
        if (currentEBook) {
            return getAudioFiles(currentEBook._id, "Phần", true);
        } else {
            return [];
        }
    }, [currentEBook])

    const addTrackToPlayer = (item: AudioFile) => {
        const newTrack: Track = {
            id: item.id,
            url: item.url,
            title: item.title,
            artist: currentEBook?.author?.name ?? "Unknown",
            duration: 100,
        }
        setTimeout(() => {
            console.log("play");
            addTrack(newTrack);
            play();
            dispatch(setIsLoading(false));
        }, 2000);
    }


    const handlePlay = (item: AudioFile) => {
        if (!currentEBook) return;
        if (track) {
            if (isPlaying) {
                pause();
            } else {
                play();
            }
        } else {
            dispatch(setIsLoading(true));
            addTrackToPlayer(item);
        }
    }

    const firstPlay = (item: AudioFile) => {
        setVisible(false);
        dispatch(setIsLoading(true));
        if (!currentEBook) return;
        if (track) {
            onClear();
        }
        addTrackToPlayer(item);
        const i = data.findIndex(it => it.id === item.id);
        setIndex(i);
    }

    const handleNext = () => {
        if (index < data.length - 1) {
            setIndex(index + 1);
            firstPlay(data[index + 1]);
        }
        setVisible(false);
    }

    const handlePrev = () => {
        if (index > 0) {
            setIndex(index - 1);
            firstPlay(data[index - 1]);
        }
        setVisible(false);
    }


    useEffect(() => {
        // firstPlay(params.item);
    }, [])

    const _renderItem = (item: AudioFile, index: number) => {
        if (item.id === track?.id) {
            console.log("re", track?.id);

        }
        return (
            <View>
                <TouchableOpacity
                    onPress={() => firstPlay(item)}
                    style={styles.item}
                    key={index}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.text}>{item.title}</Text>
                        <Text style={styles.text}>{currentEBook?.title}</Text>
                    </View>
                    {
                        item.id === track?.id && <FontAwesomeIcon
                            size={20}
                            color={colors.text}
                            icon={faCompactDisc} />
                    }
                </TouchableOpacity>
                <View style={styles.line} />
            </View>
        )
    }

    console.log(index, data.length);

    return (
        <View style={[styles.container, { paddingTop: top }]}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{
                        height: 40,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <FontAwesomeIcon
                        color={colors.text}
                        icon={faChevronLeft}
                        size={20} />
                </TouchableOpacity>
                <View style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                    <Text style={styles.headerTitle}>{currentEBook?.author?.name}</Text>
                </View>
            </View>
            <View style={styles.content}>
                <View style={[styles.thumbnail, {
                    justifyContent: "center",
                    alignItems: "center",

                }]}>
                    <View style={{
                        width: width - 64,
                        height: width - 64,
                        overflow: "hidden",
                        borderRadius: 24,
                        shadowColor: colors.text + "70",
                        shadowOffset: {
                            width: 0,
                            height: 0,
                        },
                        shadowOpacity: 0.2,
                        shadowRadius: 4,
                        elevation: 8,
                    }}>
                        <FastImage
                            resizeMode="cover"
                            style={{ width: "100%", height: "100%" }}
                            source={{ uri: currentEBook?.coverImage }} />
                    </View>
                </View>
                <View style={{
                    marginVertical: 16,
                    alignItems: "center",
                }}>
                    <TextInput
                        editable={false}
                        value={currentEBook?.title ?? ""}
                        style={styles.title} />
                    <Text style={[styles.text, { color: colors.gray }]}>{currentEBook?.author?.name}</Text>
                </View>
                <View style={styles.control}>
                    <View style={{ right: 30 }}>
                        <Pressable
                            onPress={handlePrev}
                            style={[
                                styles.play
                            ]}>
                            <FontAwesomeIcon
                                color={index > 0 ? colors.text : colors.gray}
                                icon={faBackward}
                                size={20} />
                        </Pressable>
                    </View>
                    <View>
                        <View style={{}}>
                            <Pressable
                                onPress={() => handlePlay(params.item)}
                                style={[
                                    styles.play,
                                    {
                                        backgroundColor: colors.primary,
                                    }]}>
                                <FontAwesomeIcon
                                    color={colors.text}
                                    icon={isPlaying ? faPause : faPlay}
                                    size={32} />
                            </Pressable>
                        </View>
                    </View>
                    <View style={{ left: 30 }} >
                        <Pressable
                            onPress={handleNext}
                            style={[
                                styles.play
                            ]}>
                            <FontAwesomeIcon
                                color={index < data.length-1 ? colors.text : colors.gray}
                                icon={faForward}
                                size={20} />
                        </Pressable>
                    </View>
                </View>
            </View>
            <CustomBottomSheet
                onChange={(index) => {
                    setVisible(index === 1 ? true : false)
                }}
                disableBackDrop
                visible={visible}
                enablePanDownToClose={false}
                snapPoints={["20%", "70%"]}
                index={0}
                onClose={() => {
                    setVisible(false);
                }}
                backDropOpacity={0}
            >
                <View style={{ height: height * 0.7 - 40 }}>
                    <View style={{ paddingHorizontal: 16, height: 46, borderBottomWidth: 1, borderBottomColor: colors.border }}>
                        <Text style={styles.title}>Danh sách</Text>
                    </View>
                    <View>
                        {
                            currentEBook ? (
                                <ScrollView
                                    contentContainerStyle={{ paddingBottom: 62 }}
                                    style={styles.bottomSheet} >
                                    {
                                        getAudioFiles(currentEBook?._id, "Phần", true)
                                            .map(_renderItem)
                                    }
                                </ScrollView>
                            ) : (
                                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <Text>Oops! Err</Text>
                                </View>
                            )
                        }
                    </View>
                </View>
            </CustomBottomSheet>
        </View>
    )
}