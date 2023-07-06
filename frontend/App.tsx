// import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import TodoPage from "./components/TodoPage";
import Auth from "./components/Auth";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

export type RootStackParamList = {
  Auth: undefined; // undefined because you aren't passing any params to the home screen
  TodoPage: { uid: string; token: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* <View style={styles.container}> */}
        <Stack.Screen name="Auth" component={Auth} />
        <Stack.Screen name="TodoPage" component={TodoPage} />
        {/* </View> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
});
