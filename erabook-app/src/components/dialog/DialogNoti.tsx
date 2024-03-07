import { StyleSheet } from "react-native";
import React from "react";
import { Dialog } from "@rneui/themed";
import { useDispatch, useSelector } from "react-redux";
import { Types } from "../../redux/types";
import { useNavigation } from "@react-navigation/native";
import { ImageTw, TextTw, TouchableOpacityTw, ViewTw } from "../../types/type";


const DialogRedux = () => {

    const dispatch = useDispatch();
    const choose = useSelector((state: Types) => state.dialog.choose);
    const content = useSelector((state: Types) => state.dialog.content);
    const buttontext = useSelector((state: Types) => state.dialog.buttonText);
    const title = useSelector((state: Types) => state.dialog.title);


    return (
        <ViewTw >
            {
                choose == 0 ?
                    (<Loading />)
                    : choose == 1 ? (<SuccessDialog buttontext={buttontext} title={title} content={content} />)
                        : content ?
                            content.length <= 65 ?
                                (<FailedDialog buttontext={buttontext} title={title} content={content} />)
                                : (<FailedDialog66 buttontext={buttontext} title={title} content={content} />)
                            : (<ViewTw />)
            }
        </ViewTw>
    )
}

const Loading = () => {
    const visiable = useSelector((state: Types) => state.dialog.visible);
    return (
        <ViewTw>
            <Dialog isVisible={visiable} overlayStyle={{ borderRadius: 16 }} >
                <Dialog.Loading />
            </Dialog>
        </ViewTw>
    )
}

const SuccessDialog = ({ content, title, buttontext }: any) => {
    const visiable = useSelector((state: Types) => state.dialog.visible);
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const actionType = useSelector((state: Types) => state.dialog.actionType);
    const handleOnPress = () => {
        if (actionType) {
            navigation.goBack();
        }
    }
    return (
        <ViewTw>
            <Dialog isVisible={visiable} overlayStyle={{ borderRadius: 16, padding: 0 }} >
                <ViewTw className='justify-center items-center'>
                    <ViewTw className='justify-center items-center rounded-t-2xl h-44 w-full' style={{ backgroundColor: '#12C069' }}>
                        <ViewTw className='absolute w-16 h-16 justify-center items-center rounded-full' style={{ backgroundColor: '#1BD477' }}>
                            <ImageTw className='w-16 h-16' style={{ tintColor: 'white' }} source={require('../../assets/icon/System/check.png')} />
                        </ViewTw>
                    </ViewTw>
                    <ViewTw className='h-44 w-full justify-center items-center '>
                        <ViewTw className='items-center justify-center text-center px-2'>
                            <TextTw className='font-bold text-lg' style={{ color: '#1D1D1D' }}>
                                {title}
                            </TextTw>
                            <TextTw className='font-medium text-base mt-1 text-center' style={{ color: '#616161' }}>
                                {content}
                            </TextTw>
                        </ViewTw>
                        <ViewTw className='my-2' />
                        <TouchableOpacityTw onPress={() => { handleOnPress() }} className='py-3 px-12 rounded-full justify-center items-center text-center' style={{ backgroundColor: '#12C069' }}>
                            <TextTw className='font-bold text-lg' style={{ color: 'white' }}>{buttontext}</TextTw>
                        </TouchableOpacityTw>
                    </ViewTw>

                </ViewTw>
            </Dialog>
        </ViewTw>
    )
}

const FailedDialog = ({ content, title, buttontext }: any) => {
    const dispatch = useDispatch();
    const visiable = useSelector((state: Types) => state.dialog.visible);
    return (
        <ViewTw>
            <Dialog isVisible={visiable} overlayStyle={{ borderRadius: 16, padding: 0, }} >
                <ViewTw className='justify-center items-center'>
                    <ViewTw className='justify-center items-center rounded-t-2xl h-44 w-full' style={{ backgroundColor: '#DF0238' }}>
                        <ViewTw className='absolute w-16 h-16 justify-center items-center rounded-full' style={{ backgroundColor: 'none' }}>
                            <ImageTw className='w-16 h-16' style={{ tintColor: 'white' }} source={require('../../assets/icon/System/close-multiply.png')} />
                        </ViewTw>
                    </ViewTw>
                    <ViewTw className='h-44 w-full justify-center items-center px-2'>
                        <ViewTw className='items-center justify-center text-center'>
                            <TextTw className='font-bold text-lg' style={{ color: '#1D1D1D' }}>
                                {title}
                            </TextTw>
                            <TextTw className='font-medium text-base mt-1 text-center' style={{ color: '#616161' }}>
                                {content}
                            </TextTw>
                        </ViewTw>
                        <ViewTw className='my-2' />
                        <TouchableOpacityTw onPress={() => {
                        }} className=" py-3 px-12  rounded-full justify-center items-center text-center"
                                            style={{ backgroundColor: "#DF0238" }}>
                            <TextTw className='font-bold text-lg' style={{ color: 'white' }}>{buttontext}</TextTw>
                        </TouchableOpacityTw>
                    </ViewTw>
                </ViewTw>
            </Dialog>
        </ViewTw>
    )
}

const FailedDialog66 = ({ content, title, buttontext }: any) => {
    const dispatch = useDispatch();
    const visiable = useSelector((state: Types) => state.dialog.visible);
    return (
        <ViewTw>
            <Dialog isVisible={visiable} overlayStyle={{ borderRadius: 16, padding: 0, }} >
                <ViewTw className='justify-center items-center'>
                    <ViewTw className='justify-center items-center rounded-t-2xl h-44 w-full' style={{ backgroundColor: '#DF0238' }}>
                        <ViewTw className='absolute w-16 h-16 justify-center items-center rounded-full' style={{ backgroundColor: 'none' }}>
                            <ImageTw className='w-16 h-16' style={{ tintColor: 'white' }} source={require('../../assets/icon/System/close-multiply.png')} />
                        </ViewTw>
                    </ViewTw>
                    <ViewTw className='h-60 w-full justify-center items-center px-1'>
                        <ViewTw className='items-center justify-center text-center'>
                            <TextTw className='font-bold text-lg' style={{ color: '#1D1D1D' }}>
                                {title}
                            </TextTw>
                            <TextTw className='font-medium text-base mt-1 text-center' style={{ color: '#616161' }}>
                                {content}
                            </TextTw>
                        </ViewTw>
                        <ViewTw className='my-2' />
                        <TouchableOpacityTw onPress={() => {
                        }} className=" py-3 px-12  rounded-full justify-center items-center text-center"
                                            style={{ backgroundColor: "#DF0238" }}>
                            <TextTw className='font-bold text-lg' style={{ color: 'white' }}>{buttontext}</TextTw>
                        </TouchableOpacityTw>
                    </ViewTw>
                </ViewTw>
            </Dialog>
        </ViewTw>
    )
}
export default DialogRedux

const styles = StyleSheet.create({})
