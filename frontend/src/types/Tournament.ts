export type TournamentOverview = {
  tournaments?: TournamentOverviewItem[];
};

export type TournamentOverviewItem = {
  name?: string;
  date?: number;
  location?: Location;
  participantIds?: string[];
  playfieldIds?: string[];
};

export type Location = {
  name?: string;
  street?: string;
  number?: string;
  city?: string;
  postalcode?: string;
  owner?: string;
  contactPhone?: string;
  contactMail?: string;
};

export type Participant = {
  lastname?: string;
  firstname?: string;
};

export type Playfield = {
  name?: string;
};

export type Game = {
  tournamentId: string;
  playfieldId: string;
  round: number;
  position: number;
  group: number;
  pairings: Pairing[];
  rounds: GameRound[];
};

export type Pairing = {
  participantId: string;
  team?: number;
  teamOrder?: number;
};

export type GameRound = {
  roundNumber: number;
  startingPlayer: string;
  winner?: string;
};
