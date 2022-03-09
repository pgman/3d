class Primitive {
	// 球
	static ball(r, divs = 24) {
		const ret = [];
		// X軸に回転する
		for(let rx = 0; rx < divs / 2; rx += 1) {
			const ax = rx / divs * 2 * Math.PI;
			const cy = r * Math.cos(ax);
			const cr = Math.abs(r * Math.sin(ax));

			const nax = (rx + 1) / divs * 2 * Math.PI;
			const ny = r * Math.cos(nax);
			const nr = Math.abs(r * Math.sin(nax));

			// Y軸に回転する
			for(let ry = 0; ry < divs; ry += 1) {
				const ay = ry / divs * 2 * Math.PI;
				const nay = (ry + 1) / divs * 2 * Math.PI;
				const cosay = Math.cos(ay);
				const sinay = Math.sin(ay);
				const cosnay = Math.cos(nay);
				const sinnay = Math.sin(nay);
				// 三角形は外側から見て反時計回りになるようにする
				if(nr > 0.001) {
					ret.push([
						{ x: cr * cosay, y: cy, z: cr * sinay, },
						{ x: nr * cosay, y: ny, z: nr * sinay, },
						{ x: nr * cosnay, y: ny, z: nr * sinnay, },
					]);
				}

				if(cr > 0.001) {
					ret.push([
						{ x: cr * cosay, y: cy, z: cr * sinay, },
						{ x: nr * cosnay, y: ny, z: nr * sinnay, },
						{ x: cr * cosnay, y: cy, z: cr * sinnay, },
					]);
				}
				
			}
		}
		return ret;
	}
}