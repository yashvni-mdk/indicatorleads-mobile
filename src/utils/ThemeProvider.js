import React, {createContext, useContext, useState, useEffect} from 'react';
import {useColorScheme} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const lightModeColors = {
  text: '#222',
  background: '#fff',
  appBackground: 'transparent',
  bottomIcon: '#a2a4a8',
  buttonBackground: '#ddd',
  headerColor: '#0CB986', // Default header color
  lightColor: '#57f2c4',
  grayColor: '#c7c7c7',
  purpleColor: '#e8c9fa',
  lightRedColor: '#fad7d2',
  redColor: '#f95252',
  lightBlue: '#8dd3f5',
  lightGreen: '#56e756',
};

const darkModeColors = {
  text: '#222',
  background: '#fff',
  appBackground: 'transparent',
  bottomIcon: '#a2a4a8',
  buttonBackground: '#ddd',
  headerColor: '#0CB986', // Default header color
  lightColor: '#57f2c4',
  grayColor: '#c7c7c7',
  purpleColor: '#e8c9fa',
  lightRedColor: '#fad7d2',
  redColor: '#f95252',
  lightBlue: '#8dd3f5',
  lightGreen: '#56e756',
};

// AsyncStorage keys
const THEME_KEY = 'appTheme';
const CUSTOM_COLORS_KEY = 'customColors';

// Create a context for the theme
const ThemeContext = createContext();

// Custom hook to use the ThemeContext
export const useTheme = () => useContext(ThemeContext);

// ThemeProvider component to wrap the entire app
export const ThemeProvider = ({children}) => {
  const systemColorScheme = useColorScheme();
  const [colorTheme, setColorTheme] = useState(systemColorScheme);
  const [customColors, setCustomColors] = useState({});

  useEffect(() => {
    // Load theme and custom colors from AsyncStorage when the app starts
    const loadSettings = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_KEY);
        const savedCustomColors = await AsyncStorage.getItem(CUSTOM_COLORS_KEY);

        if (savedTheme) {
          setColorTheme(savedTheme); // Set saved theme (light/dark)
        } else {
          setColorTheme(systemColorScheme); // Fallback to system theme if no saved theme
        }

        if (savedCustomColors) {
          setCustomColors(JSON.parse(savedCustomColors)); // Set saved custom colors
        }
      } catch (error) {
        console.error('Failed to load settings', error);
      }
    };

    loadSettings();
  }, [systemColorScheme]);

  // Function to toggle between light and dark mode
  const toggleTheme = async () => {
    const newTheme = colorTheme === 'light' ? 'dark' : 'light';
    setColorTheme(newTheme);

    try {
      AsyncStorage.setItem(THEME_KEY, newTheme); // Save theme to AsyncStorage
    } catch (error) {
      console.error('Failed to save theme', error);
    }
  };

  // Function to set custom header color
  const setCustomHeaderColor = color => {
    console.log('Get Color Value>>>', color);
    const updatedColors = {...customColors, headerColor: color};
    setCustomColors(updatedColors);

    try {
      AsyncStorage.setItem(CUSTOM_COLORS_KEY, JSON.stringify(updatedColors)); // Save custom colors to AsyncStorage
    } catch (error) {
      console.error('Failed to save custom colors', error);
    }
  };

  // Merge system theme with custom colors
  const theme = {
    ...(colorTheme === 'dark' ? darkModeColors : lightModeColors),
    ...customColors,
  };

  return (
    <ThemeContext.Provider
      value={{theme, toggleTheme, colorTheme, setCustomHeaderColor}}>
      {children}
    </ThemeContext.Provider>
  );
};
