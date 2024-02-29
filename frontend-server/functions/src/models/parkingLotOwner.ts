class Owner {
  ownerId: string;
  name: string;
  approved: boolean;

  constructor(ownerId: string, name: string, approved: boolean = false) {
    this.ownerId = ownerId;
    this.name = name;
    this.approved = approved;
  }
}

export { Owner };



