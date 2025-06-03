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
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { 
  User, 
  Mail, 
  Phone, 
  Bell, 
  Shield, 
  CreditCard, 
  Download, 
  Upload, 
  Trash2, 
  Settings as SettingsIcon,
  Globe,
  Moon,
  Sun,
  Smartphone,
  Lock,
  Eye,
  EyeOff,
  Camera,
  Save,
  RefreshCw
} from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const Settings = () => {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    bio: ''
  });
  
  const [preferences, setPreferences] = useState({
    darkMode: true,
    notifications: {
      email: true,
      push: true,
      sms: false,
      marketing: false
    },
    language: 'en',
    currency: 'USD',
    timezone: 'UTC'
  });

  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    dataSharing: false,
    analytics: true,
    twoFactor: false
  });

  useEffect(() => {
    if (user) {
      setProfileData(prev => ({
        ...prev,
        firstName: user.user_metadata?.first_name || '',
        lastName: user.user_metadata?.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.user_metadata?.bio || ''
      }));
    }
  }, [user]);

  const handleProfileUpdate = async () => {
    setIsLoading(true);
    try {
      await updateProfile({
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        bio: profileData.bio
      });
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Error updating profile",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = () => {
    toast({
      title: "Data export started",
      description: "We'll email you when your data export is ready.",
    });
  };

  const handleDeleteAccount = () => {
    toast({
      title: "Account deletion",
      description: "Please contact support to delete your account.",
      variant: "destructive",
    });
  };

  return (
    <Layout>
      <div className="min-h-screen text-white">
        {/* Header Section */}
        <motion.div 
          className="mb-8"
          variants={stagger}
          initial="initial"
          animate="animate"
        >
          <motion.h1 
            className="text-4xl lg:text-5xl font-bold mb-4"
            variants={fadeInUp}
          >
            Account <span className="text-green-400">Settings</span>
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-300 max-w-2xl"
            variants={fadeInUp}
          >
            Manage your account preferences, security settings, and privacy controls.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <motion.div
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Profile Information */}
            <motion.div
              variants={cardVariants}
              whileHover={{ scale: 1.01 }}
              className="bg-gray-900/50 rounded-2xl p-6 backdrop-blur-sm border border-gray-700/50 shadow-2xl"
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-green-600/20 rounded-xl">
                  <User className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Profile Information</h3>
                  <p className="text-gray-400">Update your personal details</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={user?.user_metadata?.avatar_url} />
                      <AvatarFallback className="bg-green-600 text-white text-xl">
                        {profileData.firstName?.charAt(0) || profileData.email?.charAt(0)?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <button className="absolute -bottom-2 -right-2 p-2 bg-green-600 rounded-full text-white hover:bg-green-500 transition-colors">
                      <Camera className="h-4 w-4" />
                    </button>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Profile Picture</h4>
                    <p className="text-sm text-gray-400">JPG, GIF or PNG. Max size 2MB.</p>
                    <div className="flex space-x-2 mt-2">
                      <Button size="sm" variant="outline" className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </Button>
                      <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-gray-300">First Name</Label>
                    <Input
                      id="firstName"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                      className="bg-gray-800 border-gray-600 text-white focus:border-green-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-gray-300">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                      className="bg-gray-800 border-gray-600 text-white focus:border-green-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      disabled
                      className="pl-10 bg-gray-800 border-gray-600 text-gray-400"
                    />
                  </div>
                  <p className="text-xs text-gray-500">Email cannot be changed</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-300">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="phone"
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                      className="pl-10 bg-gray-800 border-gray-600 text-white focus:border-green-500"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-gray-300">Bio</Label>
                  <textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-green-500 resize-none"
                    rows={3}
                    placeholder="Tell us about yourself..."
                  />
                  <p className="text-xs text-gray-500">{profileData.bio.length}/160 characters</p>
                </div>

                <Button 
                  onClick={handleProfileUpdate}
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-500 text-white"
                >
                  {isLoading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                  Save Changes
                </Button>
              </div>
            </motion.div>

            {/* Preferences */}
            <motion.div
              variants={cardVariants}
              whileHover={{ scale: 1.01 }}
              className="bg-gray-900/50 rounded-2xl p-6 backdrop-blur-sm border border-gray-700/50 shadow-2xl"
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-blue-600/20 rounded-xl">
                  <SettingsIcon className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Preferences</h3>
                  <p className="text-gray-400">Customize your app experience</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300">Language</Label>
                    <Select value={preferences.language} onValueChange={(value) => setPreferences(prev => ({ ...prev, language: value }))}>
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300">Currency</Label>
                    <Select value={preferences.currency} onValueChange={(value) => setPreferences(prev => ({ ...prev, currency: value }))}>
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="CAD">CAD (C$)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Timezone</Label>
                  <Select value={preferences.timezone} onValueChange={(value) => setPreferences(prev => ({ ...prev, timezone: value }))}>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="EST">Eastern Time</SelectItem>
                      <SelectItem value="PST">Pacific Time</SelectItem>
                      <SelectItem value="CST">Central Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Moon className="h-5 w-5 text-gray-400" />
                    <div>
                      <Label className="text-white">Dark Mode</Label>
                      <p className="text-sm text-gray-400">Use dark theme across the app</p>
                    </div>
                  </div>
                  <Switch 
                    checked={preferences.darkMode}
                    onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, darkMode: checked }))}
                    className="data-[state=checked]:bg-green-600"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {/* Security */}
            <motion.div
              variants={cardVariants}
              whileHover={{ scale: 1.01 }}
              className="bg-gray-900/50 rounded-2xl p-6 backdrop-blur-sm border border-gray-700/50 shadow-2xl"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-red-600/20 rounded-lg">
                  <Shield className="h-5 w-5 text-red-400" />
                </div>
                <h3 className="text-lg font-bold text-white">Security</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white text-sm">Two-Factor Authentication</Label>
                    <p className="text-xs text-gray-400">Extra security for your account</p>
                  </div>
                  <Switch 
                    checked={privacy.twoFactor}
                    onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, twoFactor: checked }))}
                    className="data-[state=checked]:bg-green-600"
                  />
                </div>
                
                <Button variant="outline" className="w-full bg-gray-800 border-gray-600 text-white hover:bg-gray-700">
                  <Lock className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
                
                <Button variant="outline" className="w-full bg-gray-800 border-gray-600 text-white hover:bg-gray-700">
                  <Smartphone className="h-4 w-4 mr-2" />
                  Manage Devices
                </Button>
              </div>
            </motion.div>

            {/* Notifications */}
            <motion.div
              variants={cardVariants}
              whileHover={{ scale: 1.01 }}
              className="bg-gray-900/50 rounded-2xl p-6 backdrop-blur-sm border border-gray-700/50 shadow-2xl"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-yellow-600/20 rounded-lg">
                  <Bell className="h-5 w-5 text-yellow-400" />
                </div>
                <h3 className="text-lg font-bold text-white">Notifications</h3>
              </div>
              
              <div className="space-y-3">
                {Object.entries(preferences.notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <Label className="text-white text-sm capitalize">{key.replace(/([A-Z])/g, ' $1')}</Label>
                    <Switch 
                      checked={value}
                      onCheckedChange={(checked) => setPreferences(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, [key]: checked }
                      }))}
                      className="data-[state=checked]:bg-green-600"
                    />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Data & Privacy */}
            <motion.div
              variants={cardVariants}
              whileHover={{ scale: 1.01 }}
              className="bg-gray-900/50 rounded-2xl p-6 backdrop-blur-sm border border-gray-700/50 shadow-2xl"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-purple-600/20 rounded-lg">
                  <Eye className="h-5 w-5 text-purple-400" />
                </div>
                <h3 className="text-lg font-bold text-white">Privacy</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white text-sm">Profile Visibility</Label>
                    <p className="text-xs text-gray-400">Make profile visible to others</p>
                  </div>
                  <Switch 
                    checked={privacy.profileVisible}
                    onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, profileVisible: checked }))}
                    className="data-[state=checked]:bg-green-600"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white text-sm">Data Sharing</Label>
                    <p className="text-xs text-gray-400">Share data with partners</p>
                  </div>
                  <Switch 
                    checked={privacy.dataSharing}
                    onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, dataSharing: checked }))}
                    className="data-[state=checked]:bg-green-600"
                  />
                </div>
                
                <Separator className="bg-gray-700" />
                
                <Button 
                  variant="outline" 
                  className="w-full bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                  onClick={handleExportData}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
                
                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={handleDeleteAccount}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
