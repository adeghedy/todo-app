import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../App";

type ProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "TodoPage"
>;

type Props = {
  navigation: ProfileScreenNavigationProp;
  route: any;
};

interface IPost {
  id?: string;
  content: string;
  userId: string;
}

interface PostAPIData {
  status: string;
  results: number;
  data: {
    posts: IPost[];
  };
}

const TodoPage = ({ navigation, route }: Props) => {
  const [token, setToken] = useState<string>(route.params.token);
  const [userId, setUserId] = useState<string>(route.params.uid);
  const [todos, setTodos] = useState<IPost[]>([]);

  const [currTodoContent, setCurrTodoContent] = useState<string>("");
  const [newTodo, setNewTodo] = useState<IPost>({
    content: "",
    userId,
    id: "",
  });

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch(
        `http://192.168.1.9:3002/api/posts/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data: PostAPIData = await response.json();
      setTodos(data.data.posts);
    } catch (error) {
      console.log(error);
    }
  };

  // Create new todo using fetch
  const createTodo = async (content: String) => {
    try {
      setCurrTodoContent("");

      const response = await fetch(
        `http://192.168.1.9:3002/api/posts/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content, userId }),
        }
      );
      const data: PostAPIData = await response.json();

      return data.data.posts[0];
    } catch (error) {
      console.log(error);
    }
  };

  // delete todo using fetch
  const deleteTodo = async (id: String) => {
    try {
      await fetch(`http://192.168.1.9:3002/api/posts/${userId}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddTodo = async () => {
    if (currTodoContent.trim() === "") return;
    // Can't perform optimistic update, since we get the id from the server
    const data = await createTodo(currTodoContent);

    if (data) {
      setTodos([...todos, data]);
    }
  };

  const handleDeleteTodo = async (index: number) => {
    const updatedTodos = [...todos];
    const deletedTodoId = updatedTodos[index].id as string;
    // Optimistic update
    updatedTodos.splice(index, 1);
    setTodos(updatedTodos);

    await deleteTodo(deletedTodoId);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Todo List</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter a new todo"
          value={currTodoContent}
          onChangeText={(text) => setCurrTodoContent(text)}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddTodo}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>

      {todos.map((todo, index) => (
        <View key={index} style={styles.todoItem}>
          <Text>{todo.content}</Text>
          <TouchableOpacity onPress={() => handleDeleteTodo(index)}>
            <Text style={styles.deleteButton}>Delete</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    marginRight: 8,
    paddingHorizontal: 8,
  },
  addButton: {
    backgroundColor: "#2196F3",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  todoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  deleteButton: {
    color: "red",
    fontWeight: "bold",
  },
});

export default TodoPage;
