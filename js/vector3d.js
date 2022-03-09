// 3Dベクトルクラス(ベクトルの計算に使用)
class Vector3d {
    // 足し算
    static add(v0, v1) {
        return {
            x: v0.x + v1.x,
            y: v0.y + v1.y,
            z: v0.z + v1.z,
        };
    }
    // 引き算
    static subtract(v0, v1) {
        return {
            x: v0.x - v1.x,
            y: v0.y - v1.y,
            z: v0.z - v1.z,
        };
    }
    // スカラー倍
    static scalar(v0, s) {
        return {
            x: v0.x * s,
            y: v0.y * s,
            z: v0.z * s,
        };
    }
    // ベクトルの長さを返す
    static length(v) {
        return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
    }
    // ベクトルの距離を求める
    static distance(v0, v1) {
        const v = Vector3d.subtract(v0, v1);
        return Vector3d.length(v);
    }

    // 単位ベクトルを返す(非破壊的)
    static unit(v) {
        const len = Vector3d.length(v);
        return {
            x: v.x / len,
            y: v.y / len,
            z: v.z / len
        };
    }
    // 内積
    static innerProduct(v0, v1) {
        return v0.x * v1.x + v0.y * v1.y + v0.z * v1.z;
    }
    // 外積
    static outerProduct(v0, v1) {
        return {
            x: v0.y * v1.z - v0.z * v1.y,
            y: v0.z * v1.x - v0.x * v1.z,
            z: v0.x * v1.y - v0.y * v1.x,
        };
    }
}