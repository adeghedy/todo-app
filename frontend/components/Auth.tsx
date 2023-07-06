import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Text } from "react-native";
import { RootStackParamList } from "../App";
import { StackNavigationProp } from "@react-navigation/stack";

type ProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Auth"
>;

type Props = {
  navigation: ProfileScreenNavigationProp;
};

interface AuthAPIData {
  message?: string;
  status: string;
  token: string;
  data: {
    user: {
      id: string;
      email: string;
      password: string;
    };
  };
}

const Auth = ({ navigation }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleAuth = async (type: "login" | "signup") => {
    try {
      const response = await fetch(
        `http://192.168.1.9:3002/api/users/${type}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );
      const data: AuthAPIData = await response.json();

      if (data.message) {
        setError(data.message);
      } else {
        setError("");

        navigation.navigate("TodoPage", {
          uid: data.data.user.id,
          token: data.token,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSignup = async () => {
    handleAuth("signup");
  };

  const handleLogin = async () => {
    handleAuth("login");
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={(text) => setEmail(text)}
        value={email}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={(text) => setPassword(text)}
        value={password}
        secureTextEntry
      />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "50%",
        }}
      >
        <Button title="Login" onPress={handleLogin} />
        <Button title="Signup" onPress={handleSignup} />
      </View>
      <Text>{error}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  input: {
    width: "100%",
    height: 40,
    marginBottom: 12,
    paddingHorizontal: 10,
    borderColor: "gray",
    borderWidth: 1,
  },
});

export default Auth;
