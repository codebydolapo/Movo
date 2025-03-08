import { View, Text, ActivityIndicator, ScrollView, TouchableOpacity, TextInput, Alert, Image } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import PostCard from '@/components/PostCard';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Input from '@/components/Input';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { createComment } from '@/services/commentService';
import { generateRandomUser } from '@/services/generateRandomUser';
import Ionicons from '@expo/vector-icons/Ionicons';

interface RandomUser { firstName: string; lastName: string; fullName: string; image: string, id: string | string[] }


const CommentBox = ({ sampleCommenter }: any) => {
    return (
        <View className='h-[8rem] flex-row mx-2 rounded-xl py-2'>
            <View className='w-[15%] items-center justify-center'>
                <Image
                    // source={require("@/assets/images/pfp.jpg")}
                    source={{ uri: sampleCommenter.image }}
                    // source={{ uri: currentUser?.image }}
                    resizeMode="contain"
                    className={` w-12 h-12 rounded-full`}
                />
            </View>
            <View className='w-[85%] h-full items-center justify-around bg-[#dad8d867] rounded-xl p-2'>
                <View className='w-full h-[1.5rem] items-start justify-center'>
                    <Text className='text-lg font-rubik-semibold text-[#1da1f2]'>{sampleCommenter.fullName} • <Text className='text-xs font-rubik-medium text-[#000]'>Jan 3</Text></Text>
                </View>
                <View className='w-full h-[3rem]'>
                    <Text className='text-sm'>{sampleCommenter.comment}</Text>
                </View>
                <View className='w-full h-[2rem] flex-row items-center justify-start gap-x-2'>
                    <TouchableOpacity className='w-[3rem] h-full items-center justify-start flex-row gap-x-1'>
                        <Text className='text-sm'>15</Text>
                        <Ionicons name="heart" size={15} color="#f00" />
                    </TouchableOpacity>
                    <TouchableOpacity className='w-[3rem] h-full items-center justify-center flex-row gap-x-1'>
                        <Text className='text-sm'>23</Text>
                        <Ionicons name="chatbox" size={15} color="#1da1f2" />
                    </TouchableOpacity>

                    <TouchableOpacity className='w-[3rem] h-full items-center justify-end flex-row gap-x-1'>
                        <Text className='text-sm'>27</Text>
                        <Ionicons name="share-social" size={15} color="#000" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}


const Post = () => {
    const { id } = useLocalSearchParams<{ id: string | string[] }>();

    const { user } = useAuth()

    const router = useRouter()


    const [post, setPost] = useState(null)
    const [comment, setComment] = useState("")
    const [loading, setLoading] = useState(false)
    // const [_randomUser, setRandomUser] = useState({})
    const _randomUser = useRef<RandomUser>()

    useEffect(() => {
        // console.log(id, userName)
        getPostDetails(id!);
        _randomUser.current = { ...generateRandomUser(id), id }
    }, [])

    const getPostDetails = async (id: string | string[]) => {
        try {
            const { data, error } = await supabase
                .from("posts")
                .select(`
                    *,
                    user: users(id, name, image),
                    postLikes(*)
                `)
                .eq("id", id)
                .single()

            if (error) {
                console.log("Fetch Post Error", error);
                return { success: false, msg: "Could not fetch post" };
            }

            // console.log(data);
            if (data) {
                setPost(data)
            }

            return { success: true, data };

        } catch (error) {
            console.log(error)
        }
    }

    const onNewComment = async () => {
        if (!comment) return null
        let data = {
            userId: user?.id,
            postId: post?.id,
            text: comment
        }

        setLoading(true)
        let res = await createComment(data)
        setLoading(false)
        if (res?.success) {
            setComment("")
        } else {
            Alert.alert("Error creating comment")
        }
    }

    const sampleCommenter = [
        {
            fullName: "David Blaine",
            image: "https://mrwallpaper.com/images/hd/cool-profile-pictures-panda-man-gsl2ntkjj3hrk84s.jpg",
            comment: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi quibusdam optio"
        },
        {
            fullName: "Kelly Taylor",
            image: "https://i.pinimg.com/236x/c8/d0/9d/c8d09dccfb7518fc483caa701bf4e248.jpg",
            comment: "Nisi quibusdam optio tenetur nostrum beatae voluptatibus accusamus blanditiis ad alias!"
        }
    ]

    return (
        <>
            {
                !post ?
                    <View className='flex-1 h-screen w-screen bg-white items-center justify-center'>
                        <ActivityIndicator size={"small"} />
                    </View>

                    :


                    <View className='flex-1 h-screen w-screen bg-white'>
                        <ScrollView showsHorizontalScrollIndicator={false} contentContainerStyle={{ alignItems: 'center' }} >
                            <View className='h-[3rem] w-full flex-row items-center justify-center mt-2 relative'>
                                <TouchableOpacity className='absolute left-0 rounded-full bg-[#4242421a] ml-3' onPress={() => router.back()}>
                                    <MaterialCommunityIcons name={"chevron-left"} size={35} color="#000" />
                                </TouchableOpacity>
                            </View>
                            <PostCard
                                item={post}
                                currentUser={_randomUser.current}
                                router={router}
                                showMoreIcon={false}
                            />
                            <View className='min-h-[3rem] max-h-[4rem] w-[98%] border-[1px] border-[#0000003d] rounded-xl items-center justify-center flex-row '>
                                <View className='flex-1'>
                                    <Input
                                        placeholder='Type a comment...'
                                        value={comment}
                                        handleChange={(value) => { setComment(value) }}
                                        secure={false}
                                        multiline={true}
                                    />
                                </View>
                                {
                                    loading ?
                                        <View className='w-[3rem]'>
                                            <ActivityIndicator size={"small"} />
                                        </View>
                                        :
                                        <TouchableOpacity className='border-[1px] border-[#0000003d] rounded-xl mr-2 p-2'>
                                            <Ionicons name={"paper-plane-outline"} size={25} color="#25d366" />
                                        </TouchableOpacity>
                                }
                            </View>

                            <View className='mt-4 mb-10 w-full gap-y-4'>
                                <CommentBox
                                    sampleCommenter={sampleCommenter[0]}
                                />
                                <CommentBox
                                    sampleCommenter={sampleCommenter[1]}
                                />
                            </View>
                        </ScrollView>
                    </View>
            }
        </>
    )
}

export default Post