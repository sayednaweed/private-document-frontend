import React, { createContext, useContext, useEffect, useReducer } from "react";
import axiosClient from "../lib/axois-client";
import { User } from "@/database/tables";
import { returnPermissions } from "@/lib/utils";
// import secureLocalStorage from "react-secure-storage";
interface AuthState {
  authenticated: boolean;
  user: User;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  setUser: (user: User) => Promise<void>;
  logout: () => Promise<void>;
}
type Action =
  | { type: "LOGIN"; payload: User }
  | { type: "EDIT"; payload: User }
  | { type: "LOGOUT" }
  | { type: "STOP_LOADING" };

type Dispatch = React.Dispatch<Action>;
const initUser: User = {
  id: "",
  fullName: "",
  username: "",
  email: "",
  status: false,
  grantPermission: false,
  profile: "",
  role: { role: 2, name: "admin" },
  job: "",
  contact: "",
  department: "",
  permissions: new Map(),
  createdAt: "",
};
const initialState: AuthState = {
  user: initUser,
  authenticated: false,
  loading: true,
  login: () => Promise.resolve(),
  setUser: () => Promise.resolve(),
  logout: () => Promise.resolve(),
};
const StateContext = createContext<AuthState>(initialState);
const DispatchContext = createContext<React.Dispatch<Action>>(() => {});

function reducer(state: AuthState, action: Action) {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        authenticated: true,
        user: action.payload,
      };
    case "LOGOUT":
      localStorage.removeItem(import.meta.env.VITE_TOKEN_STORAGE_KEY);
      return {
        ...state,
        authenticated: false,
        user: initUser,
      };
    case "EDIT":
      return {
        ...state,
        user: action.payload,
      };
    case "STOP_LOADING":
      return {
        ...state,
        loading: false,
      };
    default:
      throw new Error("Unknown action type");
  }
}
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem(
          import.meta.env.VITE_TOKEN_STORAGE_KEY
        );
        if (token === null || token === undefined) {
          return;
        }
        await axiosClient
          .get("auth-user", {
            headers: {
              "Content-Type": "application/json",
            },
          })
          .then(({ data }) => {
            const user = data.user as User;
            if (user != null)
              user.permissions = returnPermissions(data?.permissions);
            dispatch({ type: "LOGIN", payload: user });
          });
      } catch (err) {
        console.log(err);
        dispatch({ type: "LOGOUT" });
      } finally {
        dispatch({ type: "STOP_LOADING" });
      }
    };
    loadUser();
  }, []);
  const login = async (email: string, password: string): Promise<any> => {
    let response: any = null;
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      response = await axiosClient.post("auth-login", formData);
      if (response.status == 200) {
        localStorage.setItem(
          import.meta.env.VITE_TOKEN_STORAGE_KEY,
          response.data.token
        );
        const user = response.data.user as User;
        if (user != null)
          user.permissions = returnPermissions(response.data?.permissions);
        dispatch({ type: "LOGIN", payload: user });
      }
    } catch (error: any) {
      response = error;
      console.log(error);
    }
    return response;
  };
  const setUser = async (user: User): Promise<any> => {
    try {
      if (user != null || user != undefined)
        dispatch({ type: "EDIT", payload: user });
    } catch (error: any) {
      console.log(error);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await axiosClient.post("auth-logout");
    } catch (error: any) {
      console.log(error);
    }
    dispatch({ type: "LOGOUT" });
  };

  return (
    <StateContext.Provider value={{ ...state, login, logout, setUser }}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
};

export const useAuthState = () => useContext(StateContext);
export const useAuthDispatch: () => Dispatch = () =>
  useContext(DispatchContext);
