import { createContext, useState } from "react";

const ConversationMessages = createContext();

export const ConversationMessagesProvider = ({ children }) => {
  const [conversationMessageList, setConversationMessageList] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);

  return (
    <ConversationMessages.Provider
      value={{
        conversationMessageList,
        setConversationMessageList,
        currentConversationId,
        setCurrentConversationId,
      }}
    >
      {children}
    </ConversationMessages.Provider>
  );
};

export default ConversationMessages;
