import React, { createContext, useEffect, useReducer } from "react";
import SplashScreen from "src/components/SplashScreen";
import firebase from "src/firebase";

interface AuthState {
  isAuthenticated: boolean;
  isInitialised: boolean;
  user: {
    id: string;
    avatar?: string;
    email: string;
    name: string;
  } | null;
}

const initialAuthState: AuthState = {
  isAuthenticated: false,
  isInitialised: false,
  user: null,
};

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case "AUTH_STATE_CHANGED": {
      const { isAuthenticated, user } = action.payload;

      return {
        ...state,
        isAuthenticated,
        isInitialised: true,
        user,
      };
    }
    case "PROFILE_UPDATED": {
      const { displayName } = action.payload;

      return {
        ...state,
        user: {
          ...state.user,
          name: displayName,
        },
      };
    }
    default: {
      return { ...state };
    }
  }
};

const AuthContext = createContext({
  ...initialAuthState,
  method: "FirebaseAuth",
  createUserWithEmailAndPassword: (email: string, password: string) => Promise.resolve(),
  signInWithEmailAndPassword: (email: string, password: string) => Promise.resolve(),
  logout: () => Promise.resolve(),
  updateProfile: (displayName: string) => {},
});

type AuthProviderProps = {
  children: React.ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialAuthState);

  const signInWithEmailAndPassword = async (email: string, password: string) => {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  };

  const createUserWithEmailAndPassword = async (email: string, password: string) => {
    return firebase.auth().createUserWithEmailAndPassword(email, password);
  };

  const logout = () => {
    return firebase.auth().signOut();
  };

  const updateProfile = (displayName: string) => {
    dispatch({
      type: "PROFILE_UPDATED",
      payload: {
        displayName,
      },
    });
  };

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        dispatch({
          type: "AUTH_STATE_CHANGED",
          payload: {
            isAuthenticated: true,
            user: {
              id: user.uid,
              avatar: user.photoURL,
              email: user.email,
              name: user.displayName || user.email,
            },
          },
        });
      } else {
        dispatch({
          type: "AUTH_STATE_CHANGED",
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    });

    return unsubscribe;
  }, [dispatch]);

  if (!state.isInitialised) {
    return <SplashScreen />;
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: "FirebaseAuth",
        createUserWithEmailAndPassword,
        signInWithEmailAndPassword,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
