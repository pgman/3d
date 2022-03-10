class App {
	static init() {
		App.CANVAS_WIDTH = 800;								// <canvas>の幅
		App.CANVAS_HEIGHT = 600;							// <canvas>の高さ
		App.SUN_RADIUS = 100;								// 太陽の半径
		App.SUN_ROT_Y_SPEED = 1 / 360 * 2 * Math.PI;		// 太陽の自転の速度
		App.EARTH_RADIUS = 50;								// 地球の半径
		App.EARTH_REVOLUTION_RADIUS = 300;					// 地球の公転の半径
		App.EARTH_ROT_Y_SPEED = 2 / 360 * 2 * Math.PI;		// 地球の自転の速度
		App.EARTH_REV_Y_SPEED = 0.5 / 360 * 2 * Math.PI;	// 地球の公転の速度
		App.EARTH_AXIS = -23.4 / 360 * 2 * Math.PI;			// 地軸の傾き
		App.AMBIENT_LIGHT = { x: -1, y: -1, z: -1 };		// 環境光1
		App.AMBIENT_LIGHT_VALUE = 0.8;						// 環境光1の係数
		App.AMBIENT_LIGHT2 = { x: 1, y: 1, z: 1 };			// 環境光2
		App.AMBIENT_LIGHT2_VALUE = 0.2;						// 環境光2の係数

		const canvas = document.getElementById('canvas');
		canvas.width = App.CANVAS_WIDTH;
		canvas.height = App.CANVAS_HEIGHT;
		const ctx = canvas.getContext('2d');

		App.sunRotY = 0;		// 太陽自転
		App.earthRotY = 0;		// 地球自転転
		App.earthRevY = 0;		// 地球公転		
		App.shading = false;	// シェーディングするか
		App.sunRotYCheck = true;	// 太陽が自転するか
		App.earthRotYCheck = true;	// 地球が自転するか
		App.earthRevYCheck = true;	// 地球が公転するか
		App.viewRotX = 0;	// X軸周りの回転角
		App.viewRotY = 0;	// Y軸周りの回転角
		App.sun = null;		// 太陽の三角形群
		App.earth = null;	// 地球の三角形群
		App.divides = 16;	// 太陽と地球の円の分割数
		App.dividesChanged = false;		// 太陽と地球の円の分割数に変更があったか
		App.preX = 0;	// mousedown,mousemove時のX座標
		App.preY = 0;	// mousedown,mousemove時のY座標
		App.down = '';	// 'left' or 'right'
		App.viewVolume = { x: -App.CANVAS_WIDTH / 2, y: -App.CANVAS_HEIGHT / 2, 
			w: App.CANVAS_WIDTH, h: App.CANVAS_HEIGHT }; // 可視範囲
		App.updateTransView();

		App.attachEvents(ctx);

		setInterval(() => {
			// モデル作成
			if(!App.sun || App.dividesChanged) {
				App.sun = Primitive.ball(App.SUN_RADIUS, App.divides);
			}
			if(!App.earth || App.dividesChanged) {
				App.earth = Primitive.ball(App.EARTH_RADIUS, App.divides);
			}			
			App.dividesChanged = false;

			if(App.sunRotYCheck) { App.sunRotY += App.SUN_ROT_Y_SPEED; }		
			if(App.earthRotYCheck) { App.earthRotY += App.EARTH_ROT_Y_SPEED; }
			if(App.earthRevYCheck) { App.earthRevY += App.EARTH_REV_Y_SPEED; }			

			// ビュー行列
			let viewMatrix = Matrix4x4.identify();
			let rotXView = Matrix4x4.rotateX(App.viewRotX);
			let rotYView = Matrix4x4.rotateY(App.viewRotY);
			// <canvas> の左下隅を原点とし、上方向をY+にする
			let scaleView = Matrix4x4.scalar(1, -1, 1);
			let transView = Matrix4x4.translate(0, App.CANVAS_HEIGHT, 0);
			
			viewMatrix = Matrix4x4.multiply(rotXView, viewMatrix);
			viewMatrix = Matrix4x4.multiply(rotYView, viewMatrix);
			viewMatrix = Matrix4x4.multiply(App.transView, viewMatrix);
			viewMatrix = Matrix4x4.multiply(scaleView, viewMatrix);
			viewMatrix = Matrix4x4.multiply(transView, viewMatrix);

			// 太陽のモデル行列
			let sunMatrix = Matrix4x4.identify();
			let sunRotY = Matrix4x4.rotateY(App.sunRotY);
			sunMatrix = Matrix4x4.multiply(sunRotY, sunMatrix);		
			
			// 地球のモデル行列
			let earthMatrix = Matrix4x4.identify();			
			let earthRotY = Matrix4x4.rotateY(App.earthRotY);
			let earthRotZ = Matrix4x4.rotateZ(App.EARTH_AXIS);
			// ※地球の公転は平行移動行列を使う。そうしないと回転してしまう。
			let earthRev = Matrix4x4.rotateY(App.earthRevY);
			const earthTransPos = Matrix4x4.multiplyVec(earthRev, { x: App.EARTH_REVOLUTION_RADIUS, y: 0, z: 0 });
			const earthTrans = Matrix4x4.translate(earthTransPos.x, earthTransPos.y, earthTransPos.z);
			
			earthMatrix = Matrix4x4.multiply(earthRotY, earthMatrix);
			earthMatrix = Matrix4x4.multiply(earthRotZ, earthMatrix);
			earthMatrix = Matrix4x4.multiply(earthTrans, earthMatrix);

			// モデルを描画
			ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

			// 太陽と地球をどちらを先に描くか計算する
			// ※原点に行列を掛けて判断する
			const multiSunMatrix = Matrix4x4.multiply(viewMatrix, sunMatrix);
			const multiEarthMatrix = Matrix4x4.multiply(viewMatrix, earthMatrix);
			const sunPos = Matrix4x4.multiplyVec(multiSunMatrix, { x: 0, y: 0, z: 0 });
			const earthPos = Matrix4x4.multiplyVec(multiEarthMatrix, { x: 0, y: 0, z: 0 });

			if(sunPos.z < earthPos.z) {
				App.draw(ctx, App.sun, sunMatrix, viewMatrix, 'red', App.shading);
				App.draw(ctx, App.earth, earthMatrix, viewMatrix, 'cyan', App.shading);
			} else {
				App.draw(ctx, App.earth, earthMatrix, viewMatrix, 'cyan', App.shading);
				App.draw(ctx, App.sun, sunMatrix, viewMatrix, 'red', App.shading);				
			}
		}, 1000 / 60);
	}	
	static draw(ctx, model, modelMatrix, viewMatrix, color, shading) {
		ctx.save();
		ctx.strokeStyle = color;
		ctx.fillStyle = 'black';
		const matrix = Matrix4x4.multiply(viewMatrix, modelMatrix);
		model.forEach(tri => {
			let p = [
				Matrix4x4.multiplyVec(matrix, tri[0]),
				Matrix4x4.multiplyVec(matrix, tri[1]),
				Matrix4x4.multiplyVec(matrix, tri[2]),
			];
			const v0 = Vector3d.subtract(p[1], p[0]);
			const v1 = Vector3d.subtract(p[2], p[0]);
			// 左手座標系なので、外積は v1 から v0へ計算する
			const outer = Vector3d.outerProduct(v1, v0);
			if(outer.z > 0) {// 視点と逆側を向いているので描画しない
				return;
			}
			ctx.beginPath();		
			if(shading) {
				// 三角形を若干膨らませる(シェーディング時に三角形の継ぎ目に線ができるのを防ぐため)
				const g = {
					x: (p[0].x + p[1].x + p[2].x) / 3,
					y: (p[0].y + p[1].y + p[2].y) / 3,
					z: (p[0].z + p[1].z + p[2].z) / 3,
				};
				const scale = App.CANVAS_WIDTH / App.viewVolume.w;
				p = p.map(p => {
					let v = Vector3d.subtract(p, g);
					v = Vector3d.unit(v);
					v = Vector3d.scalar(v, scale * 1); // 係数は適当
					return Vector3d.add(p, v);
				});
	    	} 
	    	ctx.moveTo(p[0].x, p[0].y);
	    	ctx.lineTo(p[1].x, p[1].y);
	    	ctx.lineTo(p[2].x, p[2].y);
			ctx.lineTo(p[0].x, p[0].y);
    		ctx.closePath();
    		if(shading) {
    			// ワールド座標系で、輝度を計算する
    			const wp = [
					Matrix4x4.multiplyVec(modelMatrix, tri[0]),
					Matrix4x4.multiplyVec(modelMatrix, tri[1]),
					Matrix4x4.multiplyVec(modelMatrix, tri[2]),
				];
				const wv0 = Vector3d.subtract(wp[1], wp[0]);
				const wv1 = Vector3d.subtract(wp[2], wp[0]);
				const wouter = Vector3d.outerProduct(wv1, wv0);
    			const l = Vector3d.unit(App.AMBIENT_LIGHT);
    			const l2 = Vector3d.unit(App.AMBIENT_LIGHT2);
    			const n = Vector3d.unit(wouter);

    			// 内積を計算する(マイナスをつけるのは、反射光と法線ベクトルの内積を計算するため)
    			let inner = -Vector3d.innerProduct(l, n);
    			if(inner < 0) { inner = 0; }

    			let inner2 = -Vector3d.innerProduct(l2, n);
    			if(inner2 < 0) { inner2 = 0; }

    			// 輝度(色を計算する)
    			let c = 255 * (inner * App.AMBIENT_LIGHT_VALUE + inner2 * App.AMBIENT_LIGHT2_VALUE);
    			if(c > 255) { c = 255; }
    			else if(c < 0) { c = 0; }
    			if(color === 'red') {
    				ctx.fillStyle = `rgb(${c},0,0)`;
    			} else if(color === 'cyan') {
    				ctx.fillStyle = `rgb(0,${c},${c})`;
    			}
    		}
    		ctx.fill();
    		if(!shading) {
    			ctx.stroke();
    		}    		
		});
		ctx.restore();
	}
	// イベントハンドラ
	static attachEvents(ctx, prm) {
		const shadingCheck = document.getElementById('shading-checkbox');
		shadingCheck.addEventListener('change', () => {
			App.shading = shadingCheck.checked;
		});
		const sunRotationCheck = document.getElementById('sun-rotation-checkbox');
		sunRotationCheck.addEventListener('change', () => {
			App.sunRotYCheck = sunRotationCheck.checked;
		});
		const earthRotationCheck = document.getElementById('earth-rotation-checkbox');
		earthRotationCheck.addEventListener('change', () => {
			App.earthRotYCheck = earthRotationCheck.checked;
		});
		const earthRevolutionCheck = document.getElementById('earth-revolution-checkbox');
		earthRevolutionCheck.addEventListener('change', () => {
			App.earthRevYCheck = earthRevolutionCheck.checked;
		});
		const dividesSelect = document.getElementById('divides-select');
		dividesSelect.addEventListener('change', () => {
			const index = dividesSelect.selectedIndex;
			App.divides = dividesSelect.options[index].value;
			App.dividesChanged = true;
		});
		const canvas = document.getElementById('canvas');
		canvas.addEventListener('mousedown', App.mousedown);
		canvas.addEventListener('mousemove', App.mousemove);
		canvas.addEventListener('mouseup', App.mouseup);
		canvas.addEventListener('mouseout', App.mouseout);
		canvas.addEventListener('wheel', App.wheel);
		canvas.addEventListener('contextmenu', e => { e.preventDefault(); });
	} 
	static mousedown(e) {
		if(e.button === 0) {
			if(App.down !== '') { return; }
			App.preX = e.clientX;
			App.preY = e.clientY;
			App.down = 'left';
		} else if(e.button === 2) {
			if(App.down !== '') { return; }
			App.preX = e.clientX;
			App.preY = e.clientY;
			App.down = 'right';
		}
	}
	static mousemove(e) {
		let deltaX, deltaY;
		if(App.down) {
			deltaX = e.clientX - App.preX;
			deltaY = e.clientY - App.preY;			
		}
		if(App.down === 'left') {
			const canvas = document.getElementById('canvas');
			App.viewRotX += deltaY / App.CANVAS_HEIGHT * 2 * Math.PI;
			App.viewRotY += deltaX / App.CANVAS_WIDTH * 2 * Math.PI;
			App.preX = e.clientX;
			App.preY = e.clientY;
		} else if(App.down === 'right') {
			const scale = App.CANVAS_WIDTH / App.viewVolume.w;
			App.viewVolume.x -= deltaX / scale;
			App.viewVolume.y += deltaY / scale;
			App.updateTransView();			
		}
		if(App.down) {
			App.preX = e.clientX;
			App.preY = e.clientY;		
		}
	}
	static mouseup(e) {
		App.down = '';
	}
	static mouseout(e) {
		App.down = '';
	}
	static wheel(e) {
		e.preventDefault();
  		const scale = 1 + e.deltaY * (-0.001);
  		const vv = App.viewVolume;
  		const center = {
  			x: vv.x + vv.w / 2,
  			y: vv.y + vv.h / 2,
  		};
  		vv.w /= scale;
  		vv.h /= scale;
  		vv.x = center.x - vv.w / 2;
  		vv.y = center.y - vv.h / 2;
  		App.updateTransView();   		
	}
	static updateTransView() {
		const vv = App.viewVolume;
		const trans = Matrix4x4.translate(-vv.x, -vv.y, 0);
  		const scaleMat = Matrix4x4.scalar(App.CANVAS_WIDTH / vv.w, App.CANVAS_HEIGHT / vv.h, 1);
  		App.transView = Matrix4x4.multiply(scaleMat, trans);
	}
}
