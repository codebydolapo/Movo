import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import React, { useRef, useState } from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import RichTextEditor from '@/components/RichTextEditor';
import * as ImagePicker from 'expo-image-picker';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useEvent } from 'expo';
import * as FileSystem from 'expo-file-system';
import { supabase } from '@/lib/supabase';
import { decode } from 'base64-arraybuffer';

interface UploadResult {
  success: boolean;
  data?: string;
  msg?: string;
}

interface File {
  includes(arg0: string): () => any;
  type: string;
  postImage: any;
  uri?: string;
  fileName?: string;
}

const newPost = () => {
  const router = useRouter();
  const { user, setAuth } = useAuth();
  const bodyRef = useRef('');
  const editorRef = useRef('');
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<any>(null);

  const player = useVideoPlayer(file?.uri, (player) => {
    // any player setup can be done here.
    player.loop = true;
    player.play();
  });

  const { isPlaying } = useEvent(player, 'playingChange', {
    isPlaying: player?.playing,

  });

  const pickImage = async (isImage: boolean) => {
    let mediaConfig: ImagePicker.ImagePickerOptions = {
      mediaTypes: isImage ? 'images' : 'videos',
      allowsEditing: true,
      quality: 0.7,
    };

    if (isImage) {
      mediaConfig.aspect = [1, 1];
    }

    let result: ImagePicker.ImagePickerResult =
      await ImagePicker.launchImageLibraryAsync(mediaConfig);

    if (result.assets && result.assets.length > 0 && !result.canceled) {
      setFile(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
    if (!bodyRef && !file) {
      console.log("Post", "Please add an image or post")
      return;
    }

    const data = {
      file,
      body: bodyRef.current,
      userId: user?.id
    }

    const uploadFile = async (folderName: string, fileUri: string, isImage = true): Promise<UploadResult> => {
      try {
        let fileName = `${folderName + "/" + ((new Date()).getTime()) + `${folderName == "postImage" ? ".png" : ".mp4"}`}`; 
        const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        let imageData: ArrayBuffer = decode(fileBase64);
        let { data, error } = await supabase.storage.from('uploads').upload(fileName, imageData, {
          cacheControl: '3600',
          upsert: false,
        });

        if (error) {
          console.log('File upload error', error);
          return { success: false, msg: 'Could not upload media' };
        }

        console.log('Upload success:', data);
        const imageUrl: string = supabase.storage.from('uploads').getPublicUrl(data!.path).data.publicUrl;
        return { success: true, data: imageUrl };
      } catch (error) {
        console.log('File upload error', error);
        return { success: false, msg: 'Could not upload media' };
      }
    };


    const createOrUpdatePost = async (post: { file: any }) => {
      try {
        if (post.file && typeof post.file == "object") {
          let isImage = post?.file?.type == "image";
          let folderName = isImage ? "postImage" : "postVideo"
          let fileResult = await uploadFile(folderName, post?.file?.uri, isImage)
          if (fileResult.success == true) {
            post.file = fileResult.data
          }
          else {
            return fileResult
          }
        }

        const { data, error } = await supabase
          .from("posts")
          .upsert(post)
          .select()
          .single()

        if (error) {
          console.log("Create Post Error", error);
          return { success: false, msg: "Could not create your post" }
        }
        return { success: true, data: data }
      } catch (error) {
        console.log("Create Post Error", error);
        return { success: false, msg: "Could not create your post" }
      }
    }

    setLoading(true)
    const res = await createOrUpdatePost(data)
    setLoading(false)
    // console.log("Post Response:", res)
    if (res.success) {
      setFile(null);
      bodyRef.current == "",
        editorRef.current == ""
      router.back()
    }
  };

  const isLocalFile = (file: File) => {
    if (!file) return null;
    if (typeof file == 'object') return true;
    else return false;
  };

  const getFileType = (file: File) => {
    if (!file) return null;
    if (isLocalFile(file)) {
      return file.type;
    }
    if (file.includes('postImages')) {
      return 'image';
    }
    return 'video';
  };

  const getFileUri = (file: File) => {
    if (!file) return null;
    return file.uri;
  };

  return (
    <SafeAreaView className="px-4 bg-white flex-1 relative items-center">
      <View className="h-[3rem] w-full flex-row items-center justify-center mt-2 relative">
        <TouchableOpacity
          className="absolute left-0 rounded-full bg-[#4242421a]"
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons name={'chevron-left'} size={35} color="#000" />
        </TouchableOpacity>
        <Text className="font-rubik-bold text-2xl text-[#000000dc]">
          Create Post
        </Text>
      </View>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="h-[4rem] w-full flex-row items-center justify-around mt-4">
          <Image
            source={{ uri: user?.image }}
            resizeMode="contain"
            className={` w-[4rem] h-[4rem] rounded-xl`}
          />
          <View className="flex-1 h-[4rem] justify-between items-start px-2">
            <Text className="text-3xl font-rubik-bold text-[#25d366]">
              {user?.name}
            </Text>
            <View className="flex-row gap-x-1 items-around justify-center">
              <Text className="text-sm font-rubik-semibold">Public</Text>
              <Entypo name={'globe'} size={15} color="#000" />
            </View>
          </View>
        </View>
        <View className="w-full h-[20rem] my-4">
          <RichTextEditor
            editorRef={editorRef}
            onChange={(body: any) => (bodyRef.current = body)}
          />
        </View>
        {file && (
          <View className="w-full h-[20rem] rounded-xl items-center justify-center relative mt-[3rem] bg-[#000]">
            <TouchableOpacity
              onPress={() => setFile(null)}
              className="absolute top-2 right-2 z-10 bg-[#00000094] rounded-full p-2"
            >
              <MaterialIcons name="delete-outline" size={30} color="#fff" />
            </TouchableOpacity>

            {getFileType(file) == 'video' ? (
              <VideoView
                player={player}
                style={{ width: '100%', height: '100%', borderRadius: 12 }}
                // className='w-full flex-1 rounded-xl'
                allowsFullscreen
                allowsPictureInPicture
              />
            ) : (
              <Image
                source={{ uri: file.uri }}
                resizeMode="cover"
                className={` w-full flex-1 rounded-xl`}
              />
            )}
          </View>
        )}
        <View className="h-[4rem] px-2 rounded-xl flex-row justify-between items-center mt-[1rem] border-[1px] border-[#837f7f60] mb-[40%]">
          <Text className="font-rubik-medium text-[#000000a2]">
            Add To Your Post
          </Text>
          <View className="gap-x-[1rem] flex-row items-center justify-center">
            <TouchableOpacity onPress={() => pickImage(true)}>
              <FontAwesome name={'picture-o'} size={25} color="#25d366" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => pickImage(false)}>
              <Ionicons name={'videocam-outline'} size={30} color="#25d366" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {loading ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        <TouchableOpacity
          className="bg-[#25d366] w-full shadow-md shadow-zinc-300 rounded-xl py-4 mt-[4rem] flex flex-row items-center justify-center absolute bottom-[2rem] z-10"
          onPress={handleSubmit}
        >
          <Text className="text-lg font-rubik-bold text-white ml-2">Post</Text>
        </TouchableOpacity>
      )}


    </SafeAreaView>
  );
};

export default newPost;