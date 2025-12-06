import { supabase } from '@/integrations/supabase/client';
import type { UserProfile, UpdateProfileData } from '@/types/user.types';

export const userService = {
  async getProfile(userId: string): Promise<{ profile: UserProfile | null; error: string | null }> {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();

    if (error) {
      return { profile: null, error: error.message };
    }

    return {
      profile: {
        id: data.id,
        email: data.email,
        fullName: data.full_name,
        avatarUrl: data.avatar_url,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      },
      error: null,
    };
  },

  async updateProfile(
    userId: string,
    data: UpdateProfileData
  ): Promise<{ success: boolean; error: string | null }> {
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: data.fullName,
        avatar_url: data.avatarUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  },

  async createProfile(
    userId: string,
    email: string
  ): Promise<{ success: boolean; error: string | null }> {
    const { error } = await supabase.from('profiles').insert({
      id: userId,
      email,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  },
};
