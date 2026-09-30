export interface ITimelineItem {
  id: number;
  period: string;
  title: string;
  place: string;
  description: string;
  skills: string[];
  current?: boolean;
}
