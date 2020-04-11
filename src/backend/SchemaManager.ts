import Ajv from 'ajv';
import RequestSchema from './schemas/Request.json';

export class SchemaManager {
    private ajv?: Ajv.Ajv;

    constructor() {}

    initialize() {
        this.ajv = new Ajv({
            schemas: this.getSchemas(),
            useDefaults: true,
        });
    }

    getSchemas() {
        return [RequestSchema];
    }

    validateData(schemaName: string, data: any) {
        if (!this.ajv) {
            throw new Error();
        }

        const validate = this.ajv.getSchema(schemaName + '.json');
        if (!validate) {
            throw new Error();
        }
        const valid = validate(data);

        if (!valid) {
            const errors = validate.errors;
            if (errors) {
                let errorMessage;
                if (errors.length > 0) {
                    const e = errors[0];
                    errorMessage = `${e.dataPath} ${e.message || ''} (${
                        e.keyword
                    })`;
                    const params: any = e.params;
                    if (typeof params.additionalProperty == 'string') {
                        errorMessage += ` (${params.additionalProperty})`;
                    }
                }
                throw new Error(errorMessage);
            }
            throw new Error();
        }
    }
}
