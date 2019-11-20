import uuidv4 from 'uuid/v4';

export class UUID {
    public static generateString(): string {
        return uuidv4();
    }
}
