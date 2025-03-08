import { View, Text, SafeAreaView, TouchableOpacity, Image, Animated } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
// import google from "@/assets/icons/google.png"
// import * as Animatable from 'react-native-animatable'
import LottieView from 'lottie-react-native';
import { useRouter } from 'expo-router';
import _welcome from "@/assets/lottie/welcome.json"


const welcome = () => {

    const router = useRouter()

    const animationRef = useRef<LottieView>(null);

    useEffect(() => {
        animationRef.current?.play();
    }, []);


    return (
        <SafeAreaView className='flex flex-1 items-center justify-around bg-white px-2 font-rubik'>
            <View className={`w-full h-[50%] `}>
                <LottieView
                    ref={animationRef}
                    source={require("@/assets/lottie/welcome.json")}
                    style={{ flex: 1 }}
                    autoPlay loop
                />
            </View>
            <View className='w-full h-[35%] items-center justify-end pb-5'>
                <Text className='font-DancingScript-bold text-6xl'>Movo!</Text>
                <Text className='text-md text-center my-2 font-rubik-light'>Welcome... snap, share, stay in motion.</Text>
                <TouchableOpacity
                    onPress={()=>router.push("./login")}
                    className="bg-[#25d366] w-[90vw] shadow-md shadow-zinc-300 rounded-full py-4 mt-[4rem]"
                >
                    <View className="flex flex-row items-center justify-center">
                        {/* <Image
                            source={require("@/assets/icons/google.png")}
                            className="w-7 h-7"
                            resizeMode="contain"
                        /> */}
                        <Text className="text-lg font-rubik-bold text-white ml-2">
                            Sign-In Here
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push("/signup")}>
                    <Text className='text-sm mt-5'>Don't have an account? <Text className='text-[#028f36] font-bold' >Sign-Up Here.</Text></Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default welcome