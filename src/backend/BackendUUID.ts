import { Binary } from 'mongodb';
import uuidv4 from 'uuid/v4';
import { UUID } from '../shared/UUID';

export class BackendUUID extends UUID {
    public static generateBinary(): Binary {
        const buffer = uuidv4(null, Buffer.alloc(16));
        return new Binary(buffer, Binary.SUBTYPE_UUID);
    }

    public static convertStringToBinary(string: string): Binary {
        const hex =
            string.substring(0, 8) +
            string.substring(9, 13) +
            string.substring(14, 18) +
            string.substring(19, 23) +
            string.substring(24, 36);
        return new Binary(Buffer.from(hex, 'hex'), Binary.SUBTYPE_UUID);
    }

    public static convertBinaryToString(binary: Binary): string {
        const hex = binary.buffer.toString('hex');
        return (
            hex.substring(0, 8) +
            '-' +
            hex.substring(8, 12) +
            '-' +
            hex.substring(12, 16) +
            '-' +
            hex.substring(16, 20) +
            '-' +
            hex.substring(20, 32)
        );
    }
}
