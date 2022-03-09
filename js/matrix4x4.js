/*
 _             _
|   0  1  2  3  |
|   4  5  6  7  |
|   8  9 10 11  |
|_ 12 13 14 15 _|

 */
class Matrix4x4 {
	static multiply(m0, m1) {
		return [
			m0[0] * m1[0] + m0[1] * m1[4] + m0[2] * m1[8] + m0[3] * m1[12],
			m0[0] * m1[1] + m0[1] * m1[5] + m0[2] * m1[9] + m0[3] * m1[13],
			m0[0] * m1[2] + m0[1] * m1[6] + m0[2] * m1[10] + m0[3] * m1[14],
			m0[0] * m1[3] + m0[1] * m1[7] + m0[2] * m1[11] + m0[3] * m1[15],
			m0[4] * m1[0] + m0[5] * m1[4] + m0[6] * m1[8] + m0[7] * m1[12],
			m0[4] * m1[1] + m0[5] * m1[5] + m0[6] * m1[9] + m0[7] * m1[13],
			m0[4] * m1[2] + m0[5] * m1[6] + m0[6] * m1[10] + m0[7] * m1[14],
			m0[4] * m1[3] + m0[5] * m1[7] + m0[6] * m1[11] + m0[7] * m1[15],
			m0[8] * m1[0] + m0[9] * m1[4] + m0[10] * m1[8] + m0[11] * m1[12],
			m0[8] * m1[1] + m0[9] * m1[5] + m0[10] * m1[9] + m0[11] * m1[13],
			m0[8] * m1[2] + m0[9] * m1[6] + m0[10] * m1[10] + m0[11] * m1[14],
			m0[8] * m1[3] + m0[9] * m1[7] + m0[10] * m1[11] + m0[11] * m1[15],
			m0[12] * m1[0] + m0[13] * m1[4] + m0[14] * m1[8] + m0[15] * m1[12],
			m0[12] * m1[1] + m0[13] * m1[5] + m0[14] * m1[9] + m0[15] * m1[13],
			m0[12] * m1[2] + m0[13] * m1[6] + m0[14] * m1[10] + m0[15] * m1[14],
			m0[12] * m1[3] + m0[13] * m1[7] + m0[14] * m1[11] + m0[15] * m1[15],
		];
	}
	static multiplyVec(m, v) {
		return {
			x: m[0] * v.x + m[1] * v.y + m[2] * v.z + m[3],
			y: m[4] * v.x + m[5] * v.y + m[6] * v.z + m[7],
			z: m[8] * v.x + m[9] * v.y + m[10] * v.z + m[11],
		};
	}
	// 単位行列
    static identify() {
        return [
        	1, 0, 0, 0, 
        	0, 1, 0, 0, 
        	0, 0, 1, 0,
        	0, 0, 0, 1,
        ];
    }
    // 平行移動行列
    static translate(x, y, z) {
        return [
        	1, 0, 0, x, 
        	0, 1, 0, y, 
        	0, 0, 1, z,
        	0, 0, 0, 1,
        ];
    }
    // 拡大縮小行列
    static scalar(x, y, z) {
        return [
        	x, 0, 0, 0, 
        	0, y, 0, 0,
        	0, 0, z, 0,
        	0, 0, 0, 1,
        ];
    }
    // X軸回転行列
    static rotateX(theta) {
    	const cos = Math.cos(theta),
    		sin = Math.sin(theta);
        return [
        	1,   0,    0,  0, 
        	0, cos, -sin,  0, 
        	0, sin,  cos,  0,
        	0,   0,    0,  1,
        ];
    }
    // Y軸回転行列
    static rotateY(theta) {
    	const cos = Math.cos(theta),
    		sin = Math.sin(theta);
        return [
        	 cos,  0,  sin,  0, 
        	   0,  1,    0,  0, 
        	-sin,  0,  cos,  0,
        	   0,  0,    0,  1,
        ];
    }
    // Z軸回転行列
    static rotateZ(theta) {
    	const cos = Math.cos(theta),
    		sin = Math.sin(theta);
        return [
        	cos, -sin,  0,  0, 
        	sin,  cos,  0,  0, 
        	  0,    0,  1,  0,
        	  0,    0,  0,  1,
        ];
    }
}