import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ForecastRecord {
    predictedLoad: number;
    isPeak: boolean;
    actualLoad: number;
    timestamp: string;
}
export interface DatasetMetadata {
    missingValues: bigint;
    filename: string;
    timeRange: string;
    rowCount: bigint;
    uploadedAt: string;
}
export interface ModelSettings {
    refreshRate: bigint;
    learningRate: string;
    xgboostMaxDepth: bigint;
    lstmEpochs: bigint;
    batchSize: bigint;
}
export interface UserProfile {
    name: string;
}
export interface Alert {
    id: bigint;
    acknowledged: boolean;
    message: string;
    timestamp: string;
    severity: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    acknowledgeAlert(id: bigint): Promise<void>;
    addAlert(severity: string, message: string): Promise<bigint>;
    addForecastRecord(record: ForecastRecord): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearForecastRecords(): Promise<void>;
    getAllAlerts(): Promise<Array<Alert>>;
    getAllForecastRecords(): Promise<Array<ForecastRecord>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDatasetMetadata(): Promise<DatasetMetadata | null>;
    getModelSettings(): Promise<ModelSettings>;
    getSimulationMode(): Promise<boolean>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setDatasetMetadata(metadata: DatasetMetadata): Promise<void>;
    setSimulationMode(mode: boolean): Promise<void>;
    updateModelSettings(settings: ModelSettings): Promise<void>;
}
