export interface IRoom {
  id?: number;
  roomname?: string;
}

export class Room implements IRoom {
  constructor(public id?: number, public roomname?: string) {}
}

export function getRoomIdentifier(room: IRoom): number | undefined {
  return room.id;
}
