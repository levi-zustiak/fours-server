import IDescription from '../interfaces/IDescription';

export class MessageDto {
    description: IDescription;
    to: string;
    from: string;
}

export default MessageDto;