import { SplashScreen, Stack, useRouter } from "expo-router";
import "../global.css"
import { useFonts } from "expo-font"
import { useEffect, useState } from "react";
import AuthProvider, { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Session } from '@supabase/supabase-js'
import { getUserData } from "@/services/userService";
import { LogBox } from "react-native";

LogBox.ignoreLogs(["Warning: TNodeChildrenRenderer", "ReferenceError: Property 'LogB' doesn't exist", "Warning: MemoizedTNodeRenderer", "Warning: TRenderEngineProvider"])
// Define the types for the user and context value
interface User {
  id?: string;
  email?: string;
  name?: string;
  // Add other user fields as needed
}


const _layout = () => {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  )
}

function MainLayout() {
  const [loaded, error] = useFonts(
    {
      "Rubik-Bold": require("../assets/fonts/Rubik-Bold.ttf"),
      "Rubik-ExtraBold": require("../assets/fonts/Rubik-ExtraBold.ttf"),
      "Rubik-Light": require("../assets/fonts/Rubik-Light.ttf"),
      "Rubik-Medium": require("../assets/fonts/Rubik-Medium.ttf"),
      "Rubik-Regular": require("../assets/fonts/Rubik-Regular.ttf"),
      "Rubik-SemiBold": require("../assets/fonts/Rubik-SemiBold.ttf"),
      "DancingScript-Bold": require("../assets/fonts/DancingScript-Bold.ttf"),
      "DancingScript-Medium": require("../assets/fonts/DancingScript-Medium.ttf"),
      "DancingScript-Regular": require("../assets/fonts/DancingScript-Regular.ttf"),
      "DancingScript-SemiBold": require("../assets/fonts/DancingScript-SemiBold.ttf"),
    }
  )


  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync
    }

  }, [loaded])

  if (error) return null;

  const { setAuth } = useAuth()

  // const [session, setSession] = useState<any>(null)
  const [email, setEmail] = useState<string | undefined>("")

  const router = useRouter()

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      // console.log("user session:", session?.user)


      if (session) {
        setAuth(session?.user);
        updateUserData(session?.user)
        // setSession(session?.user)
        setEmail(session?.user.email)
        // console.log(session?.user.email)
        router.replace("/")
      } else {
        setAuth(null);
        router.replace("/welcome")
      }

    })

  }, [])

  const updateUserData = async (user: any) => {
    let res = await getUserData(user.id)
    if (res.success) {
      setAuth({ ...res.data, email: email })
      // console.log(session)
    }
  }


  return <Stack
    screenOptions={{
      headerShown: false,
      statusBarStyle: "dark"
    }}
  >
    <Stack.Screen
      name="postDetails/[id]"
      options={{
        presentation: "modal",
        headerShown: false,
        animation: "slide_from_bottom"
      }}
    />
  </Stack>
    ;
}


export default _layout