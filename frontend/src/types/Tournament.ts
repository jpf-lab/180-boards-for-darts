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
  group: string;
  pairing: TournamentPairing[];
  game_round: TournamentGameRound[];
};

export type TournamentPairing = {
  participantId: string;
};

export type TournamentGameRound = {
  startingPlayer: string;
  winner?: string;
};
