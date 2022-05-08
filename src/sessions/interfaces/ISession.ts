import IUser from './IUser';

interface ISession {
    id: string;
    players: Array<IUser>;
};

export default ISession;