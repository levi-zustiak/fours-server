import IDescription from '../interfaces/IDescription';

export class AcceptOfferDto {
    answer: IDescription;
    to: string;
    from: string;
}

export default AcceptOfferDto;