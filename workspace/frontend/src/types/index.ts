export interface Pet {
  tagId: string;
  name: string;
  photo: string;
  checkinDate: string;
  status: 'active' | 'ended';
}

export interface StatusUpdate {
  id: string;
  petTagId: string;
  timestamp: string;
  text: string;
  photo: string;
  overlaidPhoto?: string;
  heritageStyle?: string;
}
