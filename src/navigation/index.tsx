import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName, Pressable } from 'react-native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import ModalScreen from '../screens/ModalScreen';
import TabOneScreen from '../screens/TabOneScreen';
import { RootTabParamList, RootTabScreenProps } from '../types';

import { useAppDispatch, useAppSelector } from '../state/state'
import LoginScreen from '../screens/LoginScreen';
import WorkoutsScreen from '../screens/WorkoutsScreen';
import { AuthState, hydrateUserFromSS } from '../state/auth';

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth)

  // NO IDEA if this is how im meant todo it, but it works...
  React.useEffect(() => {
    dispatch(hydrateUserFromSS())
  }, [dispatch])

  return (
    <NavigationContainer
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {authState.loggedIn ? <MainNavigator /> : <UnauthenticatedNavigator />}
    </NavigationContainer>
  );
}


// All of the unauthenticated pages
const UnauthenticatedStack = createNativeStackNavigator();

function UnauthenticatedNavigator() {
  return (
    <UnauthenticatedStack.Navigator>
      <UnauthenticatedStack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
    </UnauthenticatedStack.Navigator>
  );
}

// All of the pages after auth
/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const MainStack = createNativeStackNavigator();

function MainNavigator() {
  return (
    <MainStack.Navigator>
      <MainStack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }} />
      <MainStack.Group screenOptions={{ presentation: 'modal' }}>
        <MainStack.Screen name="Modal" component={ModalScreen} />
      </MainStack.Group>
    </MainStack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="Workouts"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
      }}>
      <BottomTab.Screen
        name="TabOne"
        component={TabOneScreen}
        options={({ navigation }: RootTabScreenProps<'TabOne'>) => ({
          title: 'Tab One',
          tabBarIcon: ({ color }) => <FontAwesome name="code" color={color} />,
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate('Modal')}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}>
              <FontAwesome
                name="info-circle"
                size={25}
                color={Colors[colorScheme].text}
                style={{ marginRight: 15 }}
              />
            </Pressable>
          ),
        })}
      />

      <BottomTab.Screen
        name="Workouts"
        component={WorkoutsScreen}
        options={{
          title: 'Workouts',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="dumbbell" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}
function setState(arg0: AuthState) {
  throw new Error('Function not implemented.');
}

