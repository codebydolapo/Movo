import { View, Text, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import Input from '@/components/Input';
import { supabase } from '@/lib/supabase';

const Signup = () => {
    const router = useRouter()

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const validateInputs = () => {
        if (!name.trim() || !email.trim() || !password.trim()) {
            Alert.alert('Please fill in all fields');
            return false;
        }
        return true;
    };

    const signUpWithEmail = async () => {
        if (!validateInputs()) return;

        setLoading(true);

        const { data: { session }, error } = await supabase.auth.signUp({
            email: email.trim(),
            password: password.trim(),
            options: {
              data: {
                name
              }
            }
        });

        setLoading(false);

        if (error) {
            Alert.alert('Error', error.message);
        } else if (!session) {
            Alert.alert('Check your inbox for email verification!');
        } else {
            Alert.alert('Success', 'Please verify your email before logging in.');
            router.push('/login'); // Redirect to login page after successful sign-up
        }
    };

    return (
        <SafeAreaView>
            <View className='h-full w-full p-2'>
                <TouchableOpacity onPress={() => router.back()} className='p-2'>
                    <Ionicons name="chevron-back-outline" size={30} color="#000" />
                </TouchableOpacity>

                <View className='flex-1 px-2'>
                    <Text className='text-4xl font-rubik-bold text-[#000000b7] my-2'>Let's</Text>
                    <Text className='text-5xl font-rubik-bold text-[#000000b7] tracking-widest'>Get Started</Text>

                    <View className='h-[30rem] items-start justify-around mt-[4rem]'>
                        <Input
                            iconName="account-outline"
                            placeholder="Enter Your name"
                            value={name}
                            handleChange={setName}
                            secure={false}
                        />

                        <Input
                            iconName="email-outline"
                            placeholder="Enter Your email"
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
                            onPress={signUpWithEmail}
                            className="flex flex-row items-center justify-center bg-[#25d366] w-[90%] h-[3.5rem] rounded-2xl mx-auto mt-[4rem]"
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <>
                                    <MaterialCommunityIcons name="account-outline" size={25} color="#fff" />
                                    <Text className="text-lg font-rubik-bold text-white ml-2">Sign Up</Text>
                                </>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => router.push("/login")} className="mx-auto mt-4">
                            <Text className="text-sm">Already have an account? <Text className="text-[#028f36] font-bold">Login Here.</Text></Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default Signup;
