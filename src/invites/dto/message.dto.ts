import IDescription from '../interfaces/IDescription';

export class MessageDto {
    gameSessionId: string;
    description: IDescription;
    to: string;
}

export default MessageDto;