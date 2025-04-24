
import { supabase } from '@/integrations/supabase/client';
import { UserSettings } from '@/types';

export const updateUserSettings = async (settings: UserSettings) => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: userData.user.id,
        first_name: settings.first_name,
        last_name: settings.last_name,
        avatar_url: settings.avatar_url,
        birth_date: settings.birth_date,
        theme: settings.theme,
        currency: settings.currency,
        notifications_enabled: settings.notifications_enabled,
        updated_at: new Date().toISOString()
      })
      .select();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error updating user settings:', error);
    return { data: null, error };
  }
};

export const getUserSettings = async () => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userData.user.id)
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error getting user settings:', error);
    return { data: null, error };
  }
};
