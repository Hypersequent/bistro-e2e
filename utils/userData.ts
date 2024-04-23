import { faker } from '@faker-js/faker'

export class UserData {
	public getName(): string {
		return faker.person.fullName()
	}

	public getAddress(): string {
		return faker.location.streetAddress()
	}
}
