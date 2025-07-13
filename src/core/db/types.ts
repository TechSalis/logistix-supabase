const userRoles = ["customer", "rider", "company"] as const;
export type UserRole = typeof userRoles[number];

// deno-lint-ignore no-explicit-any
export function isUserRole(value: any): value is UserRole {
    return userRoles.includes(value);
}

const orderTypes = ["delivery", "food", "errands", "grocery"] as const;
export type OrderType = typeof orderTypes[number];


// deno-lint-ignore no-explicit-any
export function isOrderType(value: any): value is OrderType {
    return orderTypes.includes(value);
}


export enum OrderStatus {
    Pending = "pending",
    Accepted = "accepted",
    Processing = "processing",
    Completed = "completed",
    Cancelled = "cancelled",
}
