import { View, Text, TextInput } from 'react-native'
import React, {forwardRef} from 'react'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { IconProps } from '@expo/vector-icons/build/createIconSet';

interface Props {
    iconName?: any;
    placeholder: string;
    handleChange: (text: string) => void; 
    secure: boolean;
    value: string;
    multiline?: boolean;
    // type: string
}

const Input = ( { iconName, placeholder, value, handleChange, secure, multiline }: Props) => { 
    return (
        <View className={`flex-row ${multiline ? "h-52": "h-[4rem]"} items-center justify-center border-[1px] border-[#dfd0d041] rounded-xl px-[18px] gap-[12px] `}>
            {iconName && <MaterialCommunityIcons
                name={iconName}
                size={25}
                color={"#0007"}
            />}
            <TextInput className='flex-1'
                placeholderTextColor={"#0007"}
                placeholder={placeholder}
                value={value}
                onChangeText={handleChange}
                secureTextEntry ={secure}
                multiline = {multiline}
                />
        </View>
    );
};

export default Input