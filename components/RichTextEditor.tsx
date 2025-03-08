import { View, Text } from 'react-native'
import React from 'react'
import { actions, RichEditor, RichToolbar } from "react-native-pell-rich-editor";

const RichTextEditor = ({ editorRef, onChange }) => {
    return (
        <View className='min-h-[18rem]'>
            <RichToolbar
                editor={editorRef}
                actions={[
                    actions.insertImage,
                    actions.setBold,
                    actions.setItalic,
                    actions.insertBulletsList,
                    actions.insertOrderedList,
                    actions.insertLink,
                    actions.keyboard,
                    actions.setStrikethrough,
                    actions.setUnderline,
                    actions.removeFormat,
                    actions.insertVideo,
                    actions.checkboxList,
                    actions.undo,
                    actions.redo,
                    actions.heading1,
                    actions.heading4
                ]}
                iconMap={{
                    [actions.heading1]: ({ tintColor }: any) => <Text className={`text-[${tintColor}] font-rubik-bold`}>H1</Text>,
                    [actions.heading4]: ({ tintColor }: any) => <Text className={`text-[${tintColor}] font-rubik-bold`}>H4</Text>
                }}
                style={{ borderTopRadius: 16, backgroundColor: "#d3d3d3", borderTopRightRadius: 18, borderTopLeftRadius: 18 }}
                flatContainerStyle={{paddingHorizontal: 8, gap: 3, }}
                disabled={false}
                selectedIconTint={"#000"}
            // editorRef = {editorRef}
            />
            <RichEditor ref={editorRef} containerStyle={{ minHeight: 240, flex: 1, borderTopWidth: 0, borderBottomRightRadius: 18, borderBottomLeftRadius: 18  }} editorStyle={{ color: "black", placeholderColor: "#d3d3d3" }} placeholder="What's on your mind?" onChange={onChange} />
        </View>
    )
}

export default RichTextEditor