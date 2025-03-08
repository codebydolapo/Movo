import { supabase } from "@/lib/supabase"

export const createPostLike = async (postLike: any) => {
    try {
        const { data, error }: any = await supabase 
            .from("postLikes")
            .insert(postLike)
            .select()
            .single()

        if (error) {
            return { success: false, error }
        }

        return { success: true, data }

    } catch (error) {
        console.log("Could not like post:", error)
    }
}

export const removePostLike = async (postId: any, userId: any) => {
    try {
        const { error }: any = await supabase
            .from("postLikes")
            .delete()
            .eq("userId", userId)
            .eq("postId", postId)


        if (error) {
            return { success: false, error }
        }

        return { success: true }

    } catch (error) {
        console.log("Could not remove post like", error)
    }
}