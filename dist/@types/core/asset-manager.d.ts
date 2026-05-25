export class AssetManager {
    constructor(scene: any, physics: any);
    scene: any;
    physics: any;
    assets: any[];
    gltfLoader: any;
    xray: boolean;
    create(assetDesc: any): Asset | null;
    update(): void;
    loadGLTF(url: any): Promise<any>;
    setXray(value: any): void;
    #private;
}
export class Asset {
    constructor(name: any);
    name: any;
    entities: any[];
    joints: any[];
    get translation(): any;
    /**
     *
     * @param {number} x
     * @param {number} y
     * @param {number} z
     */
    translate(x: number, y: number, z: number): this;
    rotate(x: any, y: any, z: any): this;
    #private;
}
//# sourceMappingURL=asset-manager.d.ts.map