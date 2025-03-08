import { supabase } from "@/lib/supabase"

export const createComment = async (comment: any) => {
    try {
        const { data, error }: any = await supabase 
            .from("comments")
            .insert(comment)
            .select()
            .single()

        if (error) {
            return { success: false, error }
        }

        return { success: true, data }

    } catch (error) {
        console.log("Could not create comment:", error)
    }
}