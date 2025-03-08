import { View, Text, ScrollView, TouchableOpacity, Alert, SafeAreaView, Image } from 'react-native'
import React, { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'expo-router'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import { supabase } from '@/lib/supabase';


const postsStock = [
  {
    image: require("@/assets/stock/1.png")
  },
  {
    image: require("@/assets/stock/2.jpg")
  },
  {
    image: require("@/assets/stock/3.webp")
  },
  {
    image: require("@/assets/stock/4.jpg")
  },
  {
    image: require("@/assets/stock/5.jpg")
  },
  {
    image: require("@/assets/stock/6.webp")
  },
  {
    image: require("@/assets/stock/7.jpg")
  },
  {
    image: require("@/assets/stock/8.jpg")
  },
  {
    image: require("@/assets/stock/9.jpg")
  },
  {
    image: require("@/assets/stock/10.jpg")
  },
  {
    image: require("@/assets/stock/11.jpg")
  },
  {
    image: require("@/assets/stock/12.webp")
  },
  {
    image: require("@/assets/stock/13.jpeg")
  },
  {
    image: require("@/assets/stock/14.webp")
  },
  {
    image: require("@/assets/stock/15.jpeg")
  },
  {
    image: require("@/assets/stock/16.jpg")
  },
  {
    image: require("@/assets/stock/17.jpg")
  },
  {
    image: require("@/assets/stock/18.jpg")
  },

]

const PostsCards = ({ image }) => {
  return (
    <View className='w-[30vw] h-[31vw] my-2 rounded-lg'>
      <Image
        // tintColor={`${title !== "Profile" && "#000"}`}
        resizeMode="contain"
        className={`size-full rounded-lg`}
        source={image}

      />
    </View>
  )
}


const profile = () => {

  const { user, setAuth } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {

    Alert.alert("Confirm", "Are you sure you would like to log out?", [
      {
        text: "Cancel",
        onPress: () => console.log("Log Out Cancelled")
      },
      {
        text: "Logout",
        onPress: async () => {
          const { error } = await supabase.auth.signOut()
          if (error) {
            Alert.alert("Error Signing Out")
          }
        },
        style: "destructive"
      }
    ])
    router.push("/welcome")
  }

  // useEffect(()=>{
  //   console.log(user)
  // }, [])


  return (
    <SafeAreaView className="h-full bg-white">
      <ScrollView
        // className='px-4 items-center' 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, alignItems: 'center' }}>
        {/* header */}
        <View className='h-[3rem] w-full flex-row items-center justify-center mt-2 relative'>
          <TouchableOpacity className='absolute left-0 rounded-full bg-[#4242421a]' onPress={() => router.back()}>
            <MaterialCommunityIcons name={"chevron-left"} size={35} color="#000" />
          </TouchableOpacity>
          <Text className='font-rubik-bold text-2xl text-[#000000dc]'>Profile</Text>
          {/* <TouchableOpacity className='absolute right-0 rounded-full bg-[#4242421a] p-2' onPress={handleLogout}>
            <MaterialCommunityIcons name={"logout"} size={25} color="#f00" />
          </TouchableOpacity> */}
        </View>
        {/* profile picture */}
        {/* <View className='border-2 border-black'> */}
        <View className='w-[16rem] h-[16rem] rounded-full mt-4 relative'>
          <Image
            // source={require("@/assets/images/pfp.jpg")}
            source={{ uri: user?.image }}
            resizeMode="contain"
            className={` w-full h-full rounded-full`}
          />
          <TouchableOpacity className='absolute bottom-2 right-8 rounded-full bg-[#00000088] p-2' onPress={() => router.push("../../editProfile")}>
            <MaterialCommunityIcons name={"pencil"} size={25} color="#fff" />
          </TouchableOpacity>
        </View>
        {/* </View> */}
        {/* name and location */}
        <View className='mt-4 items-center gap-y-2'>
          <Text className='font-rubik-bold text-3xl text-[#000000dc]'>{user?.name}</Text>
          <View className='flex-row gap-x-1'>
            <EvilIcons name={"location"} size={18} color="#000" />
            <Text className='font-rubik-light text-sm text-[#000000dc]'>Lagos, <Text className='font-rubik-bold text-[#25d366]'>Nigeria</Text></Text>
          </View>
        </View>
        {/* bio */}
        <View className='mt-4'>
          <Text className='text-center font-rubik-light'>Lorem ipsum dolor sit amet consectetur adipisicing elit.</Text>
        </View>

        <View className='flex-1 flex-wrap flex-row justify-between mb-10'>
          {
            [...postsStock] // Create a shallow copy to avoid mutating the original array
              .sort(() => Math.random() - 0.5) // Shuffle the copy
              .map((item, index) => { //access the item
                return (
                  <PostsCards
                    image={item.image} //pass the image source from the item
                    key={index} //use index as key, or a unique id if you have one.
                  />
                );
              })
          }
        </View>
        <TouchableOpacity className='mb-32 items-center justify-start flex-row gap-x-2 border-[1px] border-[#0000004d] px-10 rounded-lg' onPress={handleLogout}>
          <MaterialCommunityIcons name={"toggle-switch-off-outline"} size={30} color="#f00" />
          <Text className='font-rubik-semibold'>Log Out</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  )
}

export default profile