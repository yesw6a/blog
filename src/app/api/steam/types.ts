export interface SteamGame {
  appid: number;
  name: string;
  playtime_2weeks: number;
  playtime_forever: number;
  img_icon_url: string;
  playtime_windows_forever: number;
  playtime_mac_forever: number;
  playtime_linux_forever: number;
  playtime_deck_forever: number;
}

export interface SteamRecentlyPlayedGame {
  total_count: number;
  games: SteamGame[];
}

export interface SteamOwnedGame {
  appid: number;
  playtime_forever: number;
  playtime_windows_forever: number;
  playtime_mac_forever: number;
  playtime_linux_forever: number;
  playtime_deck_forever: number;
  rtime_last_played: number;
  playtime_disconnected: number;
}

export interface SteamOwnedGames {
  game_count: number;
  games: SteamOwnedGame[];
}

export type SteamApiError = {
  error: string;
};
