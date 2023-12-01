
type HasId = {
    id: number;
}

type HasName = {
    name: string;
}

type HasIdOrName = HasId | HasName;

export { HasId, HasName, HasIdOrName };