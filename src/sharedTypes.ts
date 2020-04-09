export type ColorTypes =
  | "primary"
  | "secondary"
  | "tertiary"
  | "success"
  | "warning"
  | "danger"
  | "light"
  | "medium"
  | "dark"

export interface PlaceCoordinates {
  lat: number
  lng: number
}

export interface PlaceLocation extends PlaceCoordinates {
  address: string
  staticMapImageUrl: string
}
export class Place {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public imageUrl: string,
    public price: number,
    public availableFrom: Date,
    public availableTo: Date,
    public userId: string,
    public location: PlaceLocation,
  ) {}
}
