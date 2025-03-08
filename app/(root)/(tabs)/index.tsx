import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, Image, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import PostCard from '@/components/PostCard';
import { getUserData } from '@/services/userService';

let limit = 0;

const home = () => {
    const { user, setAuth } = useAuth();
    const router = useRouter();
    const [posts, setPosts] = useState<any[] | undefined>();

    const getPosts = async () => {
        const handleFetch = async () => {
            limit = limit + 10;
            try {
                const { data, error } = await supabase
                    .from("posts")
                    .select(`
                        *,
                        user: users(id, name, image),
                        postLikes(*),
                        comments(*)
                    `)
                    .order("created_at", { ascending: false })
                    .limit(limit);
                if (error) {
                    console.log("Fetch Post Error", error);
                    return { success: false, msg: "Could not fetch posts" };
                }
                // console.log(data);
                return { success: true, data };
            } catch (error) {
                console.log("Fetch Post Error", error);
                return { success: false, msg: "Could not fetch posts" };
            }
        };
        const res = await handleFetch();
        if (res.success) {
            setPosts(res.data);
        }
    };

    const handlePostEvent = async (payload: any) => {
        // console.log("Got post event: ", payload)
        if (payload.eventType == "INSERT" && payload?.new?.id) {
            let newPost = { ...payload.new }
            let res = await getUserData(newPost.userId)
            newPost.user = res.success ? res.data : {}
            setPosts((prevPosts) => [
                newPost, ...prevPosts
            ])
        }
    }

    useEffect(() => {
        let postChannel = supabase
            .channel("posts")
            .on("postgres_changes", { event: "*", schema: "public", table: "posts" }, handlePostEvent)
            .subscribe()
        getPosts();

        return () => {
            supabase
                .removeChannel(postChannel)
        }
    }, []);

   


    return (
        <SafeAreaView className='flex-1 bg-white px-2'>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View className='px-4'>
                    <View className='w-full items-center justify-between flex-row border-b-[1px] border-[#00000021]'>
                        <Text className='font-DancingScript-bold text-[3rem] tracking-widest text-[#000]'>Movo!</Text>
                        <View className='flex-row gap-x-2'>
                            <TouchableOpacity onPress={() => router.push("../newPost")} className=''>
                                <MaterialCommunityIcons name="pencil-plus-outline" size={30} color="#000C" />
                            </TouchableOpacity>
                            <Image
                                // tintColor={`${title !== "Profile" && "#000"}`}
                                resizeMode="contain"
                                className={`size-10 rounded-full`}
                                source={{ uri: user?.image }}

                            />
                        </View>
                    </View>
                </View>

                {/* Render PostCards directly within the ScrollView */}
                <View className="mt-5 bg-white">
                    {posts && posts.map((item) => (
                        <PostCard
                            key={item?.id.toString()}
                            item={item}
                            currentUser={user}
                            router={router}
                            showMoreIcon = {true}
                        />
                    ))}
                </View>

                {/* Add an empty view to ensure ScrollView always scrolls, even if posts are short */}
                <View className="pb-32" />
            </ScrollView>
        </SafeAreaView>
    );
};

export default home;