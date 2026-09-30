export interface IContactMessage {
  id?: number; // settes av databasen, derfor valgfri
  name: string;
  email: string;
  message: string;
}
