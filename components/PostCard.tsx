import { View, Text, Image, TouchableOpacity, useWindowDimensions, Alert, Share } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import moment, { isMoment } from "moment"
import Ionicons from '@expo/vector-icons/Ionicons';
import RenderHtml from 'react-native-render-html';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useEvent } from 'expo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Entypo from '@expo/vector-icons/Entypo';
import { createPostLike, removePostLike } from '@/services/likeService';
import stripHtml from '@/services/stripHTML';
import { Link, useRouter } from 'expo-router';
import { generateRandomUser } from '@/services/generateRandomUser';
// import newPost from '@/app/newPost';

const VideoRenderer = ({ videoUri }: any) => {
    const { player } = useVideoPlayer(videoUri, (player) => {
        player.loop = true;
        // player.play();
    });

    // const { isPlaying } = useEvent(player, 'playingChange', {
    //     isPlaying: player?.playing,
    // });

    return (
        <VideoView
            player={player}
            style={{ width: '100%', height: '100%', borderRadius: 12 }}
            allowsFullscreen
            allowsPictureInPicture
        />
    );
};

interface RandomUser { firstName: string; lastName: string; fullName: string; image: string }

const PostCard = ({ item, currentUser, router, showMoreIcon }: any) => {

    const { width } = useWindowDimensions()

    const [likes, setLikes] = useState<any>([])

    //these work normally, i just need to make them random because I don't have the strength
    const [commentsNumber, setCommentsNumber] = useState(0)
    const [sharesNumber, setSharesNumber] = useState(0)
    const randomUser = useRef<RandomUser | null>(null);

    useEffect(() => {
        // console.log(item.id)
        setLikes(item?.postLikes)
        setCommentsNumber(Math.floor(Math.random() * 50) + 1)
        setSharesNumber(Math.floor(Math.random() * 50) + 1)

        //same goes for this. I'm creating a random and imaginary person as a poster
        const _randomUser = generateRandomUser(item.id);
        randomUser.current = _randomUser;
    }, [])

    const liked = likes.filter((likes: { userId: string; }) => likes.userId == currentUser?.id)[0] ? true : false;


    const onLike = async () => {

        if (liked) {
            let updatedLikes = likes.filter((like: { userId: string; }) => like.userId != currentUser.id)
            setLikes([...updatedLikes])
            let res = await removePostLike(item.id, currentUser.id)
            // console.log("Response:", res)
            if (!res?.success) {
                Alert.alert("Something Went Wrong unliking your post")
            }
        } else {

            let data = {
                userId: currentUser?.id,
                postId: item.id
            }
            setLikes([...likes, data])
            let res = await createPostLike(data)
            // console.log("Response:", res)
            if (!res?.success) {
                Alert.alert("Something Went Wrong liking your post")
            }
        }

    }

    const onShare = async () => {
        const content = { message: stripHtml(item?.body) }
        // const downloadFile()
        Share.share(content)
    }

    const openPostDetails = () => {
        const id = item.id
        // showMoreIcon && router.push({ pathName: `postDetails/${id}`, params})
        showMoreIcon && router.push(`/postDetails/${id}`)
    }



    return (
        <View className='mb-3 px-3 pt-3 bg-white items-center '>

            <View className=' flex-row justify-between '>
                <View className='w-[15%] items-center pt-2'>
                    <Image
                        // source={require("@/assets/images/pfp.jpg")}
                        source={{ uri: randomUser.current?.image }}
                        // source={{ uri: currentUser?.image }}
                        resizeMode="contain"
                        className={` w-12 h-12 rounded-full`}
                    />
                </View>
                <View className='w-[85%] pl-1'>
                    <View className='flex-row items-between py-2 rounded-lg'>
                        <View className='flex-1 flex-row items-center gap-x-2'>
                            <View className='flex-row flex-1 border-b-[1px] border-[#00000050] pb-1 items-start justify-start'>
                                <View className='gap-1'>
                                    {/* <Text className='font-rubik-bold text-2xl text-[#1da1f2]'>{item.user.name}</Text> */}
                                    <Text className='font-rubik-bold text-2xl text-[#1da1f2]'>{randomUser?.current?.fullName}</Text>
                                    <View className='flex-row gap-x-1 items-center'>
                                        <Text className=' text-xs'>{moment(item.created_at).utcOffset('+03:00').format('MMM DD')}</Text>
                                        <Text className='mx-1'>•</Text>
                                        <Text className=' text-xs'>Public</Text>
                                        <Entypo name={'globe'} size={12} color="#000" />
                                    </View>
                                </View>
                                <View className=' py-1'>
                                    <MaterialCommunityIcons name="check-decagram" size={20} color="#1DA1F2" />
                                </View>
                            </View>
                        </View>
                        {/* <Link
                            href={{
                                pathname: `/postDetails/[id]`,
                                params: { id: item.id, userName: randomUser.current?.fullName }
                            }}
                        >
                        </Link> */}
                        {showMoreIcon && <TouchableOpacity className='' onPress={openPostDetails}>
                            <Ionicons name="ellipsis-horizontal" size={25} color="#000" />
                        </TouchableOpacity>}
                    </View>
                    <View className='gap-y-2'>
                        <View>
                            {
                                item.body &&
                                <RenderHtml
                                    contentWidth={width}
                                    source={{ html: item.body }}
                                    tagsStyles={{
                                        div: {
                                            color: "#000",
                                            fontSize: "0.9rem"
                                        },
                                        p: {
                                            color: "#000",
                                            fontSize: "1rem"
                                        },
                                        ol: {
                                            color: "#000",
                                            fontSize: "1rem"
                                        },
                                        h1: {
                                            color: "#000",
                                            fontSize: "1.5rem",
                                        },
                                        h4: {
                                            color: "#000",
                                        }
                                    }}
                                />}
                        </View>
                        {/* <View className='h-[22rem] w-full'> */}
                        {item?.file && item?.file?.includes('postImage') ? (
                            <View className='h-[20rem] w-full overflow-hidden'>
                                <Image
                                    source={{ uri: item?.file }}
                                    resizeMode="contain"
                                    className={` w-full h-full rounded-3xl `}
                                />
                            </View>
                        ) :
                            <View className='h-[14rem] w-full'>
                                <VideoRenderer videoUri={item?.file} />
                            </View>
                        }
                        {/* </View> */}
                    </View>
                </View>
            </View>
            <View className='w-[90%] h-[3rem] flex-row mt-2 items-center justify-between'>
                <TouchableOpacity className='w-1/3 h-full items-center justify-start flex-row gap-x-1' onPress={onLike}>
                    <Text className='text-sm'>{likes.length}</Text>
                    {
                        liked ?
                            <Ionicons name="heart" size={25} color="#f00" />
                            :
                            <Ionicons name="heart-outline" size={25} color="#000" />

                    }
                </TouchableOpacity>
                {showMoreIcon ?
                    <TouchableOpacity className='w-1/3 h-full items-center justify-center flex-row gap-x-1' onPress={openPostDetails}>
                        <Text className='text-sm'>{commentsNumber}</Text>
                        <Ionicons name="chatbox-outline" size={25} color="#000" />
                    </TouchableOpacity>
                    :
                    <TouchableOpacity className='w-1/3 h-full items-center justify-center flex-row gap-x-1' >
                        {showMoreIcon && <Text className='text-sm'>19</Text>}
                        <MaterialCommunityIcons name="chat-remove-outline" size={25} color="#000" />
                    </TouchableOpacity>
                }
                <TouchableOpacity className='w-1/3 h-full items-center justify-end flex-row gap-x-1' onPress={onShare}>
                    <Text className='text-sm'>{sharesNumber}</Text>
                    <Ionicons name="share-social-outline" size={25} color="#000" />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default PostCard