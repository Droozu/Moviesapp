export default class GetResponseError extends Error {
	constructor(message, body) {
		super(message);
		this.name = "GetResponseError";
		this.body = body;
	}
}