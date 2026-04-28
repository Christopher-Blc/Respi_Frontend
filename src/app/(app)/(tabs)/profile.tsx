import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient'; // Único import nuevo
import { useAuth } from '../../../context/AuthContext';
import { GlassTextButton } from '../../../components/login/glassTextButton';
import api from '../../../services/api';
import { Membresia, User } from '../../../types/types';
import createProfileStyles from '../../../style/profile.styles';
import MenuOption from '../../../components/profile/menuOptions';
import DarkModeModal from '../../../components/profile/darkMode.modal';
import IdiomaModal from '../../../components/profile/idioma.modal';
import { reservasActivasFilter } from '../../../filtrosApi';
import EditUserNameModal from '../../../components/profile/editUserName.modal';
import { useAppTheme } from '../../../context/ThemeContext';
import { useHeaderHeight } from '@react-navigation/elements';
import MembresiaModal from '../../../components/profile/membresia.modal';
import { router } from 'expo-router';
import ProfileView from '../../../components/profile/profileView';

export default function ProfileClientes() {
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <ProfileView></ProfileView>
    </ScrollView>
  );
}
