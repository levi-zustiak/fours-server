type Player = {
    id: string;
    name: string;
    socket: string;
}

class JoinSessionDto {
    gameId: string;
    player: Player;
}

export default JoinSessionDto;