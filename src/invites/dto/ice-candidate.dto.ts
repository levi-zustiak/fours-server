export class IceCandidateDto {
    gameSessionId: string;
    peer: string;
    candidate: RTCIceCandidate;
}

export default IceCandidateDto;