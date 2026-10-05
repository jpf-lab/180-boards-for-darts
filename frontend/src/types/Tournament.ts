export type TournamentOverview = TournamentOverviewItem[] | undefined;

export type TournamentItemResponse = {
  id?: string;
  name?: string;
  datetime?: string;
  locationId?: string;
  participantIds?: string[];
  playfieldIds?: string[];
};

export type TournamentOverviewItem = TournamentItemResponse & {
  location?: TournamentLocation;
};

export type TournamentLocationOverview = TournamentLocation[];

export type TournamentLocation = {
  id?: string;
  name?: string;
  street?: string;
  number?: string;
  city?: string;
  postalcode?: string;
  owner?: string;
  contactPhone?: string;
  contactMail?: string;
};

export type TournamentParticipantOverview = TournamentParticipant[];

export type TournamentParticipant = {
  id?: string;
  lastname?: string;
  firstname?: string;
};

export type TournamentPlayfieldOverview = TournamentPlayfield[];

export type TournamentPlayfield = {
  id?: string;
  name?: string;
};

export type TournamentGame = {
  id?: string;
  tournamentId: string;
  playfieldId: string;
  round: number;
  position: number;
  group: number;
  pairings: TournamentPairing[];
  rounds: TournamentGameRound[];
};

export type TournamentPairing = {
  participantId: string;
  team?: number;
  teamOrder?: number;
};

export type TournamentGameRound = {
  roundNumber: number;
  startingPlayer: string;
  winner?: string;
};
