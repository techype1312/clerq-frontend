"use client";

import React, {
  createContext,
  useReducer,
  ReactNode,
  useEffect,
  useContext,
} from "react";
import { Options } from "@openreplay/tracker";
import * as Sentry from "@sentry/nextjs";
import { isDevEnv, isTrackerEnabled, Servers } from "../../config";
import { useUserContext } from "./User";

type TrackerContextType = {
  initTracker: () => void;
  startTracking: () => void;
  stopTracking: () => void;
  setUser: (userId?: string, email?: string) => void;
  setCurrentUcrm: (ucrm?: string) => void;
  setMetadata: (key: string, value: string) => void;
  resetSession: () => void;
};

export const TrackerContext = createContext<TrackerContextType>(
  {} as TrackerContextType
);

type TrackerProviderProps = {
  children: ReactNode;
  config?: TrackerConfig;
};

export type TrackerConfig = {
  projectKey?: string;
  projectID?: string;
};

type State = {
  tracker: any | null;
  config: TrackerConfig;
};

type Action = {
  type:
    | "init"
    | "start"
    | "stop"
    | "setUser"
    | "getUser"
    | "setCurrentUcrm"
    | "setMetadata"
    | "resetSession";
  payload?: Record<string, any>;
};

async function createTracker(config: TrackerConfig): Promise<any> {
  const { default: Tracker } = await import("@openreplay/tracker");
  const trackerConfig = {
    projectKey: config.projectKey,
    projectID: config.projectID,
  };

  const tracker = new Tracker({
    ...trackerConfig,
    capturePerformance: true,
    localStorage: null,
    __DISABLE_SECURE_MODE: isDevEnv(),
  } as Options);

  return tracker;
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "init": {
      if (!state.tracker && state.config.projectKey && state.config.projectID) {
        return { ...state, tracker: action.payload?.tracker };
      }
      return state;
    }
    case "start": {
      if (!state.tracker) return state;
      state.tracker
        ?.start()
        .then(({ sessionToken }: { sessionToken: string }) => {
          Sentry.setTag("openReplaySessionToken", sessionToken);
        });
      return state;
    }
    case "stop": {
      if (!state.tracker) return state;
      state.tracker?.stop();
      return state;
    }
    case "setUser": {
      if (!state.tracker) return state;
      state.tracker?.setUserID(action.payload?.userId);
      state.tracker?.setMetadata("userEmail", action.payload?.email);
      return state;
    }
    case "setCurrentUcrm": {
      if (!state.tracker) return state;
      state.tracker?.setMetadata("ucrm", action.payload?.ucrm);
      return state;
    }
    case "setMetadata": {
      if (!state.tracker) return state;
      state.tracker?.setMetadata(action.payload?.key, action.payload?.value);
      return state;
    }
    case "resetSession": {
      if (!state.tracker) return state;
      state.tracker?.stop();
      state.tracker?.start();
      return state;
    }
    default:
      return state;
  }
}

export default function TrackerProvider({ children }: TrackerProviderProps) {
  const { userData } = useUserContext();
  const [state, dispatch] = useReducer(reducer, {
    tracker: null,
    config: {
      projectKey: Servers.TrackerProjectToken,
      projectID: Servers.TrackerProjectID,
    },
  });

  const value: TrackerContextType = {
    startTracking: () => dispatch({ type: "start" }),
    stopTracking: () => dispatch({ type: "stop" }),
    initTracker: async () => {
      const tracker = await createTracker(state.config);
      dispatch({ type: "init", payload: { tracker } });
    },
    setUser: (userId, email) =>
      dispatch({ type: "setUser", payload: { userId, email } }),
    setCurrentUcrm: (ucrmId) =>
      dispatch({ type: "setCurrentUcrm", payload: { ucrm: ucrmId } }),
    setMetadata: (key, value) =>
      dispatch({ type: "setMetadata", payload: { key, value } }),
    resetSession: () => dispatch({ type: "resetSession" }),
  };

  useEffect(() => {
    if (isTrackerEnabled()) {
      value.initTracker();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (state.tracker) {
      value.startTracking();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.tracker]);

  useEffect(() => {
    if (state.tracker && userData) {
      value.setUser(userData?.id, userData?.email);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.tracker, userData]);

  return (
    <TrackerContext.Provider value={value}>{children}</TrackerContext.Provider>
  );
}

export const useTrackerContext = () => useContext(TrackerContext);
