export interface IFacility {
  id?: number;
  facilityname?: string;
}

export class Facility implements IFacility {
  constructor(public id?: number, public facilityname?: string) {}
}

export function getFacilityIdentifier(facility: IFacility): number | undefined {
  return facility.id;
}
