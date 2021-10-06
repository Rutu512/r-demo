export interface IResident {
  id?: number;
  residentnamr?: string;
}

export class Resident implements IResident {
  constructor(public id?: number, public residentnamr?: string) {}
}

export function getResidentIdentifier(resident: IResident): number | undefined {
  return resident.id;
}
