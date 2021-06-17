export class EventTable{
  //ID: "vvG1IZ4zCXpxU9", Date: "2021-10-02", Event: "Maroon 5", Category: "Music | Rock | Pop", Venue: "Banc of California Stadium"
  ID!:string
  Date!:string
  Name!:string
  Category!:string
  Venue!:string
  isFavorite!:boolean

  constructor(ID:string, Date:string, Name:string, Category:string, Venue:string, isFavorite:boolean){
    this.ID = ID;
    this.Date = Date;
    this.Name = Name;
    this.Category = Category;
    this.Venue = Venue;
    this.isFavorite = isFavorite;
  }
}
