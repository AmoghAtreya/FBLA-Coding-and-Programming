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
  RefreshCw,
  CheckCircle,
  AlertCircle,
  UserCheck,
  Palette,
  Database
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
      <div className="min-h-screen" style={{ backgroundColor: '#f8fafc' }}>
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200 px-8 py-12 mb-8">
        <motion.div 
            className="max-w-7xl mx-auto"
          variants={stagger}
          initial="initial"
          animate="animate"
        >
            <motion.div 
              className="flex items-center space-x-4 mb-6"
            variants={fadeInUp}
          >
              <div className="p-4 rounded-2xl" style={{ backgroundColor: '#9fd1b5' }}>
                <SettingsIcon className="h-8 w-8 text-black" />
              </div>
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">
                  Account Settings
                </h1>
                <p className="text-xl text-gray-600 mt-2">
                  Manage your account preferences and security settings
                </p>
              </div>
            </motion.div>
            
            {/* Status Badge */}
            <motion.div 
              className="flex items-center space-x-2"
            variants={fadeInUp}
          >
              <Badge className="bg-green-100 text-green-800 border-green-200">
                <CheckCircle className="h-3 w-3 mr-1" />
                Account Verified
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                Premium Member
              </Badge>
            </motion.div>
        </motion.div>
        </div>

        <div className="max-w-7xl mx-auto px-8 pb-12">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="xl:col-span-3 space-y-8">
            {/* Profile Information */}
            <motion.div
              variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
              >
                {/* Card Header */}
                <div className="px-8 py-6 border-b border-gray-100" style={{ backgroundColor: '#fafbfc' }}>
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-xl" style={{ backgroundColor: '#9fd1b5' }}>
                      <User className="h-6 w-6 text-black" />
                </div>
                <div>
                      <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
                      <p className="text-gray-600">Update your personal details and public profile</p>
                    </div>
                </div>
              </div>

                <div className="p-8">
                {/* Avatar Section */}
                  <div className="flex items-center space-x-8 mb-8 p-6 bg-gray-50 rounded-2xl">
                  <div className="relative">
                      <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                      <AvatarImage src={user?.user_metadata?.avatar_url} />
                        <AvatarFallback className="text-white text-2xl font-bold" style={{ backgroundColor: '#9fd1b5' }}>
                        {profileData.firstName?.charAt(0) || profileData.email?.charAt(0)?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                      <button className="absolute -bottom-2 -right-2 p-3 rounded-full text-black hover:brightness-90 transition-all duration-200 shadow-lg border-2 border-white"
                        style={{ backgroundColor: '#9fd1b5' }}>
                      <Camera className="h-4 w-4" />
                    </button>
                  </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Profile Picture</h3>
                      <p className="text-gray-600 mb-4">Upload a new profile picture. JPG, PNG or GIF. Max size 2MB.</p>
                      <div className="flex space-x-3">
                        <Button className="text-black hover:brightness-90" style={{ backgroundColor: '#9fd1b5' }}>
                        <Upload className="h-4 w-4 mr-2" />
                          Upload Photo
                      </Button>
                        <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="firstName" className="text-sm font-semibold text-gray-700">First Name</Label>
                    <Input
                      id="firstName"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                          className="h-12 border-gray-200 focus:border-[#9fd1b5] focus:ring-[#9fd1b5] rounded-xl"
                          placeholder="Enter your first name"
                    />
                  </div>
                      <div className="space-y-3">
                        <Label htmlFor="lastName" className="text-sm font-semibold text-gray-700">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                          className="h-12 border-gray-200 focus:border-[#9fd1b5] focus:ring-[#9fd1b5] rounded-xl"
                          placeholder="Enter your last name"
                    />
                  </div>
                </div>

                    <div className="space-y-3">
                      <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Email Address</Label>
                  <div className="relative">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      disabled
                          className="h-12 pl-12 border-gray-200 bg-gray-50 text-gray-500 rounded-xl"
                    />
                        <Badge className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-green-100 text-green-800 border-green-200">
                          Verified
                        </Badge>
                  </div>
                      <p className="text-sm text-gray-500">Your email address cannot be changed for security reasons</p>
                </div>

                    <div className="space-y-3">
                      <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">Phone Number</Label>
                  <div className="relative">
                        <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      id="phone"
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                          className="h-12 pl-12 border-gray-200 focus:border-[#9fd1b5] focus:ring-[#9fd1b5] rounded-xl"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                    <div className="space-y-3">
                      <Label htmlFor="bio" className="text-sm font-semibold text-gray-700">Bio</Label>
                  <textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                        className="w-full p-4 border border-gray-200 rounded-xl focus:border-[#9fd1b5] focus:ring-[#9fd1b5] resize-none"
                        rows={4}
                    placeholder="Tell us about yourself..."
                        maxLength={160}
                  />
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-500">Brief description for your profile</p>
                        <p className="text-sm text-gray-400">{profileData.bio.length}/160</p>
                      </div>
                </div>

                    <div className="pt-4">
                <Button 
                  onClick={handleProfileUpdate}
                  disabled={isLoading}
                        className="h-12 px-8 text-black hover:brightness-90 rounded-xl font-semibold"
                        style={{ backgroundColor: '#9fd1b5' }}
                      >
                        {isLoading ? (
                          <>
                            <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                            Saving Changes...
                          </>
                        ) : (
                          <>
                            <Save className="h-5 w-5 mr-2" />
                  Save Changes
                          </>
                        )}
                </Button>
                    </div>
                  </div>
              </div>
            </motion.div>

            {/* Preferences */}
            <motion.div
              variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className="px-8 py-6 border-b border-gray-100" style={{ backgroundColor: '#fafbfc' }}>
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 rounded-xl">
                      <Palette className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                      <h2 className="text-2xl font-bold text-gray-900">App Preferences</h2>
                      <p className="text-gray-600">Customize your app experience and regional settings</p>
                    </div>
                </div>
              </div>

                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold text-gray-700">Language</Label>
                    <Select value={preferences.language} onValueChange={(value) => setPreferences(prev => ({ ...prev, language: value }))}>
                          <SelectTrigger className="h-12 border-gray-200 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">🇺🇸 English</SelectItem>
                            <SelectItem value="es">🇪🇸 Español</SelectItem>
                            <SelectItem value="fr">🇫🇷 Français</SelectItem>
                            <SelectItem value="de">🇩🇪 Deutsch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                      <div className="space-y-3">
                        <Label className="text-sm font-semibold text-gray-700">Currency</Label>
                    <Select value={preferences.currency} onValueChange={(value) => setPreferences(prev => ({ ...prev, currency: value }))}>
                          <SelectTrigger className="h-12 border-gray-200 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USD">💵 USD ($)</SelectItem>
                            <SelectItem value="EUR">💶 EUR (€)</SelectItem>
                            <SelectItem value="GBP">💷 GBP (£)</SelectItem>
                            <SelectItem value="CAD">🍁 CAD (C$)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                    <div className="space-y-6">
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold text-gray-700">Timezone</Label>
                  <Select value={preferences.timezone} onValueChange={(value) => setPreferences(prev => ({ ...prev, timezone: value }))}>
                          <SelectTrigger className="h-12 border-gray-200 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="UTC">🌍 UTC</SelectItem>
                            <SelectItem value="EST">🇺🇸 Eastern Time</SelectItem>
                            <SelectItem value="PST">🇺🇸 Pacific Time</SelectItem>
                            <SelectItem value="CST">🇺🇸 Central Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                      <div className="p-6 bg-gray-50 rounded-2xl">
                        <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                            <div className="p-2 bg-gray-700 rounded-lg">
                              <Moon className="h-5 w-5 text-white" />
                            </div>
                    <div>
                              <Label className="text-sm font-semibold text-gray-900">Dark Mode</Label>
                              <p className="text-sm text-gray-600">Use dark theme across the application</p>
                    </div>
                  </div>
                  <Switch 
                    checked={preferences.darkMode}
                    onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, darkMode: checked }))}
                            className="data-[state=checked]:bg-[#9fd1b5]"
                  />
                        </div>
                      </div>
                    </div>
                </div>
              </div>
            </motion.div>
            </div>

          {/* Sidebar */}
            <div className="xl:col-span-1 space-y-6">
            {/* Security */}
            <motion.div
              variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className="px-6 py-5 border-b border-gray-100" style={{ backgroundColor: '#fafbfc' }}>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <Shield className="h-5 w-5 text-red-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Security</h3>
                </div>
              </div>
              
                <div className="p-6 space-y-4">
                  <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <UserCheck className="h-4 w-4 text-green-600" />
                        <Label className="text-sm font-semibold text-green-900">Two-Factor Auth</Label>
                  </div>
                  <Switch 
                    checked={privacy.twoFactor}
                    onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, twoFactor: checked }))}
                    className="data-[state=checked]:bg-green-600"
                  />
                    </div>
                    <p className="text-xs text-green-700">Extra security layer for your account</p>
                </div>
                
                  <Button variant="outline" className="w-full h-11 border-gray-200 hover:bg-gray-50 rounded-xl">
                  <Lock className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
                
                  <Button variant="outline" className="w-full h-11 border-gray-200 hover:bg-gray-50 rounded-xl">
                  <Smartphone className="h-4 w-4 mr-2" />
                  Manage Devices
                </Button>
              </div>
            </motion.div>

            {/* Notifications */}
            <motion.div
              variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className="px-6 py-5 border-b border-gray-100" style={{ backgroundColor: '#fafbfc' }}>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Bell className="h-5 w-5 text-yellow-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
                </div>
              </div>
              
                <div className="p-6 space-y-4">
                {Object.entries(preferences.notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <Label className="text-sm font-medium text-gray-900 capitalize">
                        {key.replace(/([A-Z])/g, ' $1')}
                      </Label>
                    <Switch 
                      checked={value}
                      onCheckedChange={(checked) => setPreferences(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, [key]: checked }
                      }))}
                        className="data-[state=checked]:bg-[#9fd1b5]"
                    />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Data & Privacy */}
            <motion.div
              variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className="px-6 py-5 border-b border-gray-100" style={{ backgroundColor: '#fafbfc' }}>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Database className="h-5 w-5 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Data & Privacy</h3>
                </div>
              </div>
              
                <div className="p-6 space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                        <Label className="text-sm font-medium text-gray-900">Profile Visibility</Label>
                        <p className="text-xs text-gray-600">Make profile visible to others</p>
                  </div>
                  <Switch 
                    checked={privacy.profileVisible}
                    onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, profileVisible: checked }))}
                        className="data-[state=checked]:bg-[#9fd1b5]"
                  />
                </div>
                
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                        <Label className="text-sm font-medium text-gray-900">Data Sharing</Label>
                        <p className="text-xs text-gray-600">Share analytics with partners</p>
                  </div>
                  <Switch 
                    checked={privacy.dataSharing}
                    onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, dataSharing: checked }))}
                        className="data-[state=checked]:bg-[#9fd1b5]"
                  />
                    </div>
                </div>
                
                  <Separator className="my-4" />
                
                  <div className="space-y-3">
                <Button 
                  variant="outline" 
                      className="w-full h-11 border-gray-200 hover:bg-gray-50 rounded-xl"
                  onClick={handleExportData}
                >
                  <Download className="h-4 w-4 mr-2" />
                      Export My Data
                </Button>
                
                <Button 
                  variant="destructive" 
                      className="w-full h-11 bg-red-600 hover:bg-red-700 rounded-xl"
                  onClick={handleDeleteAccount}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
              </div>
                </div>
          </motion.div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
