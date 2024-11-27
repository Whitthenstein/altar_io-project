type SessionEntryType = {
  sessionID: string;
};

type SessionStoreType = {
  sessions: {
    [sessionID: string]: SessionEntryType;
  };
  getSession: (socketID: string) => SessionEntryType | null;
  setSession: (socketID: string, entry: SessionEntryType) => void;
};

export const sessionStore: SessionStoreType = {
  sessions: {},
  getSession: (socketID: string) => {
    return sessionStore.sessions[socketID];
  },
  setSession: (socketID: string, entry: SessionEntryType) => {
    sessionStore.sessions[socketID] = entry;
  },
};
