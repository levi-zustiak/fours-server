import { IUser } from "src/sessions/interfaces"

class JoinSessionDto {
    gameId: string;
    user: IUser;
}

export default JoinSessionDto;