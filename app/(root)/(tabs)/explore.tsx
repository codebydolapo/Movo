import { View, Text, SafeAreaView, ScrollView, Image } from 'react-native'
import React from 'react'
import Input from '@/components/Input'


const exploreStock = [
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


const ExploreCards = ({ image }) => {
  return (
    <View className='w-[31vw] h-[31vw] my-2 rounded-lg'>
      <Image
        // tintColor={`${title !== "Profile" && "#000"}`}
        resizeMode="contain"
        className={`size-full rounded-lg`}
        source={image}

      />
    </View>
  )
}

const explore = () => {
  return (
    <SafeAreaView className='flex-1 bg-white px-2 mb-20'>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className='w-full h-[4rem] border-[1px] border-[#0000008f] rounded-full my-2'>
          <Input
            placeholder={'Search for something...'}
            handleChange={() => { }}
            secure={false}
            value={''}
            iconName={"magnify"}
          />
        </View>
        <View className='flex-1 flex-wrap flex-row justify-between'>
          {
            exploreStock.map((item, index) => { //access the item
              return (
                <ExploreCards
                  image={item.image} //pass the image source from the item
                  key={index} //use index as key, or a unique id if you have one.
                />
              );
            })
          }
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default explore