import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import Input from '@/components/Input';
import { supabase } from '@/lib/supabase';

const Login = () => {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const validateInputs = () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert('Please enter both email and password.');
            return false;
        }
        return true;
    };

    const signInWithEmail = async () => {
        if (!validateInputs()) return;

        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password: password.trim(),
        });

        setLoading(false);

        if (error) {
            Alert.alert('Error', error.message);
        } else {
            // You can replace this with any redirect or success action
            Alert.alert('Success', 'You are now logged in.');
            // router.push('/home'); // Example redirect to home page
        }
    };

    return (
        <SafeAreaView>
            <View className='h-full w-full p-2'>
                <TouchableOpacity onPress={() => router.back()} className='p-2'>
                    <Ionicons name="chevron-back-outline" size={30} color="#000" />
                </TouchableOpacity>

                <View className='flex-1 px-2'>
                    <Text className='text-xl font-rubik-semibold text-[#000000b7] my-2'>Hello there,</Text>
                    <Text className='text-5xl font-rubik-bold text-[#000000b7] tracking-widest'>
                        Welcome back to <Text className='font-DancingScript-semibold text-[#25d366]'>Movo!</Text>
                    </Text>

                    <View className='h-[30rem] items-start justify-around mt-[4rem]'>
                        <Text className='font-rubik-semibold text-[#00000093] text-sm'>Please login to continue</Text>

                        <Input
                            iconName="email-outline"
                            placeholder="Enter Your Email"
                            value={email}
                            handleChange={setEmail}
                            secure={false}
                        />

                        <Input
                            iconName="lock-outline"
                            placeholder="Enter Your Password"
                            value={password}
                            handleChange={setPassword}
                            secure={true}
                        />

                        <TouchableOpacity 
                        // onPress={() => router.push("/forgot-password")} 
                        className='ml-auto'>
                            <Text className='text-sm'>
                                Forgot Password? <Text className='text-[#028f36] font-bold'>Click Here.</Text>
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={signInWithEmail}
                            className="flex flex-row items-center justify-center bg-[#25d366] w-[90%] h-[3.5rem] rounded-2xl mx-auto mt-[4rem]"
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <>
                                    <MaterialCommunityIcons name="account-outline" size={25} color="#fff" />
                                    <Text className="text-lg font-rubik-bold text-white ml-2">Login</Text>
                                </>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => router.push("/signup")} className='mx-auto mt-4'>
                            <Text className='text-sm'>
                                Don't have an account? <Text className='text-[#028f36] font-bold'>Sign-up Here.</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default Login;
