"use client";

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
export const MainContext = createContext<any>(null);

const loadWindowInfo = async () => {
  return import("@/utils/window-info").then((windowInfo) => windowInfo);
};

type Action = {
  type: "init";
  value?: Record<string, any>;
};

type State = {
  windowInfo: any | null;
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "init": {
      if (!state.windowInfo) {
        return { ...state, windowInfo: action.value?.windowInfo };
      }
      return state;
    }
    default:
      return state;
  }
}

type MainContextType = {
  windowInfo?: Record<string, any>;
  initWindowInfo: () => void;
};

export const MainContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [windowWidth, setWindowWidth] = useState<number | null>(null);
  const [state, dispatch] = useReducer(reducer, {
    windowInfo: null,
  });

  const value: MainContextType = {
    initWindowInfo: async () => {
      const windowInfo = await loadWindowInfo();
      dispatch({ type: "init", value: { windowInfo: windowInfo.default } });
    },
  };

  useEffect(() => {
    value.initWindowInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth);
    }
    window.addEventListener("resize", () => {
      setWindowWidth(window.innerWidth);
    });

    return () => {
      window.removeEventListener("resize", () => {
        setWindowWidth(window.innerWidth);
      });
    };
  }, []);

  return (
    <MainContext.Provider
      value={
        {
          windowWidth,
          windowInfo: state.windowInfo,
        } as any
      }
    >
      {children}
    </MainContext.Provider>
  );
};

export const useMainContext = () => useContext(MainContext);
