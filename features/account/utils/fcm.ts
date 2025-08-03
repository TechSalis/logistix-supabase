export type FCMNotification = {
    title: string;
    body: string;
};

export type FCMData = {
    event: FCMEvent;
    source: FCMSource;
} & Record<string, unknown>;

export enum FCMEvent {
    orderUpdate = "order-update",
}
export enum FCMSource {
    system = "system",
}

