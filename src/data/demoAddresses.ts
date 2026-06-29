import { IAddress } from "../types/Address";
import { User } from "../types/Mainview";

export const getDemoAddresses = (user: User | null) => {
    return [
        {
            id: 1,
            fullName: user?.name || 'John Doe',
            street: '123 Main Street',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'USA',
            phone: '+1 234 567 8900',
            isDefault: true,
        },
    ]
};