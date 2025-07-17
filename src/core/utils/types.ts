export type Coordinates = {
    lat: number;
    lng: number;
};
export type ValidatorResponse = {
    valid: boolean;
    error?: string;
};

export type Method = "GET" | "POST" | "PUT" | "DELETE";

export type PageData = {
    page: number;
    size: number;
};