import { Tabs } from "expo-router";
import { Image, ImageSourcePropType, Text, View } from "react-native";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

// import icons from "@/constants/icons";

const TabIcon = ({
    focused,
    icon,
    title,
}: {
    focused: boolean;
    icon: ImageSourcePropType;
    title: string;
}) => (
    <View className="flex-1 flex flex-col items-center justify-center">
        <Image
            source={icon}
            tintColor={`${title !== "Profile" && "#000"}`}
            resizeMode="contain"
            className={`size-7 ${title == "Profile" && "rounded-full "} mt-9`}

        />
        {/* <MaterialCommunityIcons name={icon} size={20} color="#000" /> */}
        <Text
            className={`${focused
                    ? "text-[#25d366] font-rubik-medium"
                    : "text-black font-rubik-medium"
                } text-sm w-full text-center mt-1`}
        >
            {title}
        </Text>
    </View>
);

const TabsLayout = () => {
    return (
        <Tabs
            screenOptions={{
                tabBarShowLabel: false,
                tabBarStyle: {
                    backgroundColor: "white",
                    position: "absolute",
                    borderTopColor: "#0061FF1A",
                    borderTopWidth: 1,
                    minHeight: 60,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} icon={require("@/assets/icons/home.png")} title="Home" />
                    ),
                }}
            />
            <Tabs.Screen
                name="explore"
                options={{
                    title: "Explore",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} icon={require("@/assets/icons/Explore.png")} title="Explore" />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} icon={require("@/assets/images/pfp.jpg")} title="Profile" />
                    ),
                }}
            />

        </Tabs>
    );
};

export default TabsLayout;