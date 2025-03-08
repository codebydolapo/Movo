import { View, Text, TouchableOpacity, ScrollView, Image, ActivityIndicator, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Input from '@/components/Input';
import { useAuth} from '@/contexts/AuthContext'; // Assuming AuthContextType is exported
import { useRouter, useNavigation } from 'expo-router'; // useNavigation is not used in this code but is common with useRouter
import { supabase } from '@/lib/supabase';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';
import { ImagePickerAsset } from 'expo-image-picker';

interface User {
    address: string;
    bio?: string;
    image?: string | ImagePickerAsset;
    phoneNumber?: string;
    id: string;
    email: string;
    name: string;
}

interface UploadResult {
    success: boolean;
    data?: string;
    msg?: string;
}

const EditProfile = () => {
    const router = useRouter();
    const { user: currentUser, setAuth } = useAuth(); // Explicitly type destructured values
    const [user, setUser] = useState<Partial<User>>({
        name: '',
        phoneNumber: '',
        image: '',
        bio: '',
        email: '',
        address: '',
    });
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (currentUser) {
            setUser({
                name: currentUser.name || '',
                phoneNumber: currentUser.phoneNumber || '',
                image: currentUser.image || '',
                bio: currentUser.bio || '',
                email: currentUser.email || '',
                address: currentUser.address || '',
            });
        }
    }, [currentUser]);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            let userData: Partial<User> = { ...user };
            let { name, phoneNumber, bio, email, address } = userData;

            if (!name || !phoneNumber || !bio || !email || !address) {
                Alert.alert('Profile', 'Please fill all the fields');
                setLoading(false);
                return;
            }

            if (typeof user.image === 'object' && user.image.uri) {
                const uploadImage = async (folderName: string, fileUri: string, isImage = true): Promise<UploadResult> => {
                    try {
                        let fileName = `${folderName + "/" + ((new Date()).getTime()) + ".png"}`; // Assuming PNG
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

                const uploadResult: UploadResult = await uploadImage('images', user.image.uri);
                if (uploadResult.success) {
                    userData.image = uploadResult.data; // Set the full URL
                    setUser({ ...user, image: uploadResult.data });
                }
            }

            const res: { success: boolean; data?: Partial<User>; msg?: string } = await updateUser(currentUser?.id || '', userData);
            setLoading(false);
            if (res.success) {
                setAuth({ ...currentUser, ...userData });
            }
            router.push('./profile');
            console.log('Updated user profile:', res);
        } catch (error) {
            console.error('Error updating profile', error);
        } finally {
            setLoading(false);
        }
    };

    const updateUser = async (userId: string, data: Partial<User>): Promise<{ success: boolean; data?: Partial<User>; msg?: string }> => {
        try {
            const { error } = await supabase
                .from("users")
                .update(data)
                .eq("id", userId);

            if (error) {
                return { success: false, msg: error.message };
            }
            return { success: true, data };
        } catch (error: unknown) {
            if (error instanceof Error) {
                return { success: false, msg: error.message };
            }
            return { success: false, msg: "Unknown error occurred" };
        }
    };

    const pickImage = async () => {
        let result: ImagePicker.ImagePickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        if (!result.canceled) {
            setUser({ ...user, image: result.assets[0] });
        }
    };


    return (
        <SafeAreaView className="h-full bg-white">
            <ScrollView
                // className='px-4 items-center' 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16, alignItems: 'center', height: "auto", paddingBottom: 30 }}
            >
                <View className='h-[3rem] w-full flex-row items-center justify-center mt-2 relative'>
                    <TouchableOpacity
                        className="absolute left-0 rounded-full bg-[#4242421a]"
                        onPress={() => router.back()}  // Ensure it works
                        activeOpacity={0.7}  // Improve UX
                    >
                        <MaterialCommunityIcons name={"chevron-left"} size={35} color="#000" />
                    </TouchableOpacity>
                    <Text className='font-rubik-bold text-2xl text-[#000000dc]'>Edit Your Profile</Text>

                </View>
                <View className='w-[16rem] h-[16rem] rounded-full mt-4 relative'>
                    <Image
                        source={
                            user.image && typeof user.image === 'string'
                                ? { uri: user.image }
                                : require("@/assets/images/pfp.jpg")
                        }
                        resizeMode="contain"
                        className={`w-full h-full rounded-full`}
                    />
                    <TouchableOpacity className='absolute bottom-2 right-8 rounded-full bg-[#00000088] p-2' onPress={pickImage}>
                        <MaterialCommunityIcons name={"camera-outline"} size={25} color="#fff" />
                    </TouchableOpacity>
                </View>
                <View className='mt-3 w-full gap-y-2 h-auto py-2'>
                    <Input
                        iconName="account-outline"
                        placeholder="Enter Your name"
                        value={user.name}
                        handleChange={(value) => { setUser({ ...user, name: value }) }}
                        secure={false}
                        multiline={false}
                    />
                    <Input
                        // iconName="account-outline"
                        placeholder="Enter Your Bio"
                        value={user.bio}
                        handleChange={(value) => { setUser({ ...user, bio: value }) }}
                        secure={false}
                        multiline={true}
                    />
                    <Input
                        iconName="email-outline"
                        placeholder="Enter Your email"
                        value={user.email}
                        handleChange={(value) => { setUser({ ...user, email: value }) }}
                        secure={false}
                        multiline={false}
                    />
                    <Input
                        iconName="phone-outline"
                        placeholder="Enter your Phone Number"
                        value={user.phoneNumber}
                        handleChange={(value) => { setUser({ ...user, phoneNumber: value }) }}
                        secure={false}
                        multiline={false}
                    />
                    <Input
                        iconName="pin-outline"
                        placeholder="Enter your Address"
                        value={user.address}
                        handleChange={(value) => { setUser({ ...user, address: value }) }}
                        secure={false}
                        multiline={false}
                    />
                </View>
                <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={loading}
                    className="bg-[#25d366] w-[90vw] rounded-full py-4 mt-[4rem] flex-row items-center justify-center"
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text className="text-lg font-rubik-bold text-white">
                            Submit
                        </Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    )
}

export default EditProfile



