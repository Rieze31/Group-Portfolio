// Maps a card's id (from the Spring Boot API) to its portfolio file.
// To add a new portfolio: create a file like VenzonPortfolio.jsx, then add it here.
import VenzonPortfolio from "./VenzonPortfolio.jsx";
import TimbasPortfolio from "./TimbasPortfolio.jsx";
import SantosPortfolio from "./SantosPortfolio.jsx";
import GarciaPortfolio from "./GarciaPortfolio.jsx";

export const PORTFOLIOS = {
  venzon: VenzonPortfolio,
  dwight: VenzonPortfolio,
  garcia: GarciaPortfolio,
  bella: GarciaPortfolio,
  santos: SantosPortfolio,
  liza: SantosPortfolio,
  timbas: TimbasPortfolio,
  donny: TimbasPortfolio,
};
