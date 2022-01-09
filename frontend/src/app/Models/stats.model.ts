export class StatsModel {
  dayStats: number;
  weekStats: number;
  monthStats: number;
  yearStats: number;

  constructor(dayStats: number, weekStats: number, monthStats: number, yearStats: number) {
    this.dayStats = dayStats;
    this.weekStats = weekStats;
    this.monthStats = monthStats;
    this.yearStats = yearStats;
  }
}
