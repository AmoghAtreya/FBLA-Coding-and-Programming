/**
 * Settings Page
 * 
 * User settings and profile management interface.
 * Features:
 * - Profile information management
 * - Notification preferences
 * - Security settings
 * - Help and support access
 * - Account tab navigation
 * 
 * Sections:
 * - Account: Personal information and preferences
 * - Notifications: Email and push notification settings
 * - Security: Password management and logout
 * - Help: Support resources and documentation
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, User, Bell, Lock, HelpCircle, CreditCard } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { format } from 'date-fns';
import { cn } from "@/lib/utils";
import { updateUserSettings, getUserSettings } from '@/services/userService';
import Layout from '@/components/Layout';
import { UserSettings } from '@/types';

const Settings = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('account');
  const [profile, setProfile] = useState<UserSettings>({
    first_name: '',
    last_name: '',
    avatar_url: '',
    birth_date: undefined
  });
  
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    weekly: false,
    marketing: false
  });
  
  const [birthDate, setBirthDate] = useState<Date | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    try {
      const { data, error } = await getUserSettings();
      if (error) throw error;
      if (data) {
        setProfile(data);
        if (data.birth_date) {
          setBirthDate(new Date(data.birth_date));
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        title: "Error loading profile",
        description: "Could not load your profile information",
        variant: "destructive"
      });
    }
  };

  const handleUpdateProfile = async () => {
    setIsLoading(true);
    try {
      await updateUserSettings(profile);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully"
      });
    } catch (error) {
      toast({
        title: "Error updating profile",
        description: "Could not update your profile",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <Layout>
      <motion.div 
        className="container mx-auto p-4 max-w-4xl"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 gap-4 mb-8">
            <TabsTrigger value="account" className="flex items-center gap-2">
              <User size={16} />
              <span>Account</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell size={16} />
              <span>Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Lock size={16} />
              <span>Security</span>
            </TabsTrigger>
            <TabsTrigger value="help" className="flex items-center gap-2">
              <HelpCircle size={16} />
              <span>Help</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="account" className="space-y-6">
            <div className="grid gap-6">
              <div className="space-y-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={profile.first_name || ''}
                      onChange={(e) => setProfile({...profile, first_name: e.target.value})}
                      placeholder="John"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profile.last_name || ''}
                      onChange={(e) => setProfile({...profile, last_name: e.target.value})}
                      placeholder="Doe"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="avatarUrl">Profile Picture URL</Label>
                    <Input
                      id="avatarUrl"
                      value={profile.avatar_url || ''}
                      onChange={(e) => setProfile({...profile, avatar_url: e.target.value})}
                      placeholder="https://example.com/avatar.jpg"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label>Date of Birth</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn("w-full justify-start text-left font-normal", !birthDate && "text-muted-foreground")}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {birthDate ? format(birthDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={birthDate}
                          onSelect={setBirthDate}
                          disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                
                <Button onClick={handleUpdateProfile} disabled={isLoading} className="w-full">
                  {isLoading ? "Updating..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailNotif" className="text-base">Email Notifications</Label>
                  <p className="text-sm text-gray-500">Receive email updates about your account</p>
                </div>
                <Switch
                  id="emailNotif"
                  checked={notifications.email}
                  onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="pushNotif" className="text-base">Push Notifications</Label>
                  <p className="text-sm text-gray-500">Receive push notifications about transactions</p>
                </div>
                <Switch
                  id="pushNotif"
                  checked={notifications.push}
                  onCheckedChange={(checked) => setNotifications({...notifications, push: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="weeklyNotif" className="text-base">Weekly Summary</Label>
                  <p className="text-sm text-gray-500">Get a weekly summary of your finances</p>
                </div>
                <Switch
                  id="weeklyNotif"
                  checked={notifications.weekly}
                  onCheckedChange={(checked) => setNotifications({...notifications, weekly: checked})}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label>Change Password</Label>
                <Input type="password" placeholder="Current password" />
                <Input type="password" placeholder="New password" />
                <Input type="password" placeholder="Confirm new password" />
                <Button className="w-full">Update Password</Button>
              </div>
              
              <div className="pt-4">
                <Button variant="destructive" onClick={signOut} className="w-full">
                  Sign Out
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="help" className="space-y-6">
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Need Help?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  If you're having trouble with your account or have questions about using FinFlow,
                  our support team is here to help.
                </p>
                <Button variant="outline" className="w-full">Contact Support</Button>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Documentation</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Check out our documentation for detailed guides and tutorials on using FinFlow.
                </p>
                <Button variant="outline" className="w-full">View Documentation</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </Layout>
  );
};

export default Settings;
