 import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
 
const TOKEN_KEY = 'user_auth_token';
const REFRESH_TOKEN_KEY = 'user_refresh_token';

type LogoutCallback = () => void;
let logoutListener: LogoutCallback | null = null;

export const onForceLogout = (callback: LogoutCallback) => {
  logoutListener = callback;
};


export const saveToken = async (token: string) => {
  if (Platform.OS === 'web') {
    return localStorage.setItem(TOKEN_KEY, token);
  }else{
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  }
};

export const getToken = async () => {

  if (Platform.OS === 'web') {
    return localStorage.getItem(TOKEN_KEY);
  }else{
    return await SecureStore.getItemAsync(TOKEN_KEY);
  }

};

export const deleteToken = async () => {

  if(Platform.OS === 'web'){
    return localStorage.removeItem(TOKEN_KEY);
  }else{
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  }
};

export const saveRefreshToken = async (token: string) => {

  if (Platform.OS === 'web') {
    return localStorage.setItem(REFRESH_TOKEN_KEY, token);
  }else{
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
  }
};

export const getRefreshToken = async () => {

  if (Platform.OS === 'web') {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }else{
    return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  }

};

export const deleteRefreshToken = async () => {

  if(Platform.OS === 'web'){
    return localStorage.removeItem(REFRESH_TOKEN_KEY);
  }else{
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  }
};


export const logout = async (isForced: boolean = false) => {
     
  await deleteToken();
  await deleteRefreshToken(); 
  if (isForced && logoutListener) {
    logoutListener();
  }
};


