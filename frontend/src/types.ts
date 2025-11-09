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
    national_id: string;
    first_name: string;
    last_name: string;
    date_of_birth: string;
    gender: string;
    place_of_birth: string;
}

export interface CitizenUpdate {
    first_name?: string;
    last_name?: string;
    date_of_birth?: string;
    gender?: string;
    place_of_birth?: string;
}

export interface Permission {
    id: number;
    name: string;
}

export interface Role {
    id: number;
    name: string;
    permissions: Permission[];
}

export interface UserCreate {
    username: string;
    email: string;
    password: string;
    role_id: number;
}

export interface User {
    id: number;
    username: string;
    email: string;
    is_active: boolean;
    role: Role;
}

