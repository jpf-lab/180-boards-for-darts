export type TournamentOverview = {
  tournaments?: TournamentOverviewItemResponse[];
};

export type TournamentOverviewItemResponse = {
  name?: string;
  date?: number;
  locationId?: string;
  participantIds?: string[];
  playfieldIds?: string[];
};

export type TournamentOverviewItem = TournamentOverviewItemResponse & {
  location?: Location;
};

export type TournamentLocation = {
  name?: string;
  street?: string;
  number?: string;
  city?: string;
  postalcode?: string;
  owner?: string;
  contactPhone?: string;
  contactMail?: string;
};

export type TournamentParticipant = {
  lastname?: string;
  firstname?: string;
};

export type TournamentPlayfield = {
  name?: string;
};

export type TournamentGame = {
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
