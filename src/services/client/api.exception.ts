export class ApiException extends Error {
    constructor(public status: number, public message: string) {
        super(message);
        this.name = 'ApiException';
    }
}