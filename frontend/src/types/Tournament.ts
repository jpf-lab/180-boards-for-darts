export type TournamentOverview = {
  tournaments: TournamentOverviewItem[];
};

export type TournamentOverviewItem = {
  name: string;
  date: number;
  location: string;
  participants: string[];
  playfields: string[];
};
