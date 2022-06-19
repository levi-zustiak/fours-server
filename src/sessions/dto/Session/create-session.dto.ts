type Player = {
    id: string;
    name: string;
    socket: string;
};

export class CreateSessionDto {
    player: Player;
}

export default CreateSessionDto;