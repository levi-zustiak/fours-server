import { IUser, IDescription } from '../interfaces';

export class MessageDto {
    to: IUser;
    description: IDescription;
}

export default MessageDto;