type MessageType = "MOVE" | "NEW_GAME" | "REPLY"

type MessageData = {
    col?: number;
    answer?: boolean;
}

class MessageDto {
    type: MessageType;
    data: MessageData;
}

export default MessageDto;