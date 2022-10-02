import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './src/hooks/useCachedResources';
import useColorScheme from './src/hooks/useColorScheme';
import Navigation from './src/navigation';
import { Provider as StoreProvider } from 'react-redux'
import { store } from './src/state/state'
import { Provider as PaperProvider } from 'react-native-paper';

import { ToastProvider } from 'react-native-toast-notifications'


export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <PaperProvider>
          <ToastProvider>
            <StoreProvider store={store}>
                <Navigation colorScheme={colorScheme} />
                <StatusBar />
            </StoreProvider>
          </ToastProvider>
        </PaperProvider>
      </SafeAreaProvider>
    );
  }
}
