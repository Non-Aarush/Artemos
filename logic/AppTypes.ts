export interface TleData {
    name: string;
    line1: string;
    line2: string;
}

export interface Coords {
    x: number;
    y: number;
    z: number;
}

export interface SatInfo {
    id: string;
    name: string;
    type: string;
    tle: TleData;
    position?: Coords;
    velocity?: number;
    altitude?: number;
    country?: string;
    launchDate?: string;
}

export interface Groups {
    id: string;
    name: string;
    url: string;
}
