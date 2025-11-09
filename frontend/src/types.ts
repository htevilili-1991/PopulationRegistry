export interface Citizen {
    id: number;
    national_id: string;
    first_name: string;
    last_name: string;
    date_of_birth: string;
    gender: string;
    place_of_birth: string;
}

export interface CitizenCreate {
    first_name: string;
    last_name: string;
    date_of_birth: string;
    gender: string;
    place_of_birth: string;
}
