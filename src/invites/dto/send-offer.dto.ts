import IDescription from '../interfaces/IDescription';

export class SendOfferDto {
    offer: IDescription;
    from: string;
    to: string;
}

export default SendOfferDto;