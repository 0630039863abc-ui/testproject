import{f as I,r as d,j as e,h as _e,m as fe,d as z,b as J,u as Ne,A as pe,e as G,L as Ee,R as Me}from"./index-VyhKji2U.js";import{u as P,a as V,C as Le,O as Ae,F as Ce,T as te}from"./Float-DNRs5TNb.js";import{as as he,dh as ze,cc as se,cY as X,d1 as U,di as Te,h as K,cP as me,a as M,d6 as xe,d7 as ie,dj as ne,V as be,c as ke,v as B,dk as Ue,b as Pe,cG as Be,d as ve,da as Y,d8 as Oe,H as Re,t as re,a4 as De,aP as Ie,b7 as ge,d4 as He,Z as Fe,D as We,Q as Ge}from"./extends-BVG4NNlv.js";import{R as Ve,P as $e,a as qe,b as Qe}from"./RadarChart-Bg7Ur1rJ.js";import"./with-selector-BwKRMBZb.js";import"./CategoricalChart-kx1i0unR.js";import"./ordinal-C42Khp9f.js";const Xe=[["path",{d:"M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z",key:"hh9hay"}],["path",{d:"m3.3 7 8.7 5 8.7-5",key:"g66t2b"}],["path",{d:"M12 22V12",key:"d0xqtd"}]],Ye=I("box",Xe);const Je=[["path",{d:"M12 15V3",key:"m9g1x1"}],["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["path",{d:"m7 10 5 5 5-5",key:"brsn70"}]],Ke=I("download",Je);const Ze=[["rect",{x:"14",y:"3",width:"5",height:"18",rx:"1",key:"kaeet6"}],["rect",{x:"5",y:"3",width:"5",height:"18",rx:"1",key:"1wsw3u"}]],et=I("pause",Ze);const tt=[["path",{d:"M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",key:"10ikf1"}]],st=I("play",tt);const it=[["path",{d:"M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"14sxne"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}],["path",{d:"M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16",key:"1hlbsb"}],["path",{d:"M16 16h5v5",key:"ccwih5"}]],nt=I("refresh-ccw",it),ye=parseInt(he.replace(/\D+/g,"")),we=ye>=125?"uv1":"uv2",oe=new K,H=new M;class Z extends ze{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry";const t=[-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],s=[-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],i=[0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5];this.setIndex(i),this.setAttribute("position",new se(t,3)),this.setAttribute("uv",new se(s,2))}applyMatrix4(t){const s=this.attributes.instanceStart,i=this.attributes.instanceEnd;return s!==void 0&&(s.applyMatrix4(t),i.applyMatrix4(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}setPositions(t){let s;t instanceof Float32Array?s=t:Array.isArray(t)&&(s=new Float32Array(t));const i=new X(s,6,1);return this.setAttribute("instanceStart",new U(i,3,0)),this.setAttribute("instanceEnd",new U(i,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(t,s=3){let i;t instanceof Float32Array?i=t:Array.isArray(t)&&(i=new Float32Array(t));const n=new X(i,s*2,1);return this.setAttribute("instanceColorStart",new U(n,s,0)),this.setAttribute("instanceColorEnd",new U(n,s,s)),this}fromWireframeGeometry(t){return this.setPositions(t.attributes.position.array),this}fromEdgesGeometry(t){return this.setPositions(t.attributes.position.array),this}fromMesh(t){return this.fromWireframeGeometry(new Te(t.geometry)),this}fromLineSegments(t){const s=t.geometry;return this.setPositions(s.attributes.position.array),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new K);const t=this.attributes.instanceStart,s=this.attributes.instanceEnd;t!==void 0&&s!==void 0&&(this.boundingBox.setFromBufferAttribute(t),oe.setFromBufferAttribute(s),this.boundingBox.union(oe))}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new me),this.boundingBox===null&&this.computeBoundingBox();const t=this.attributes.instanceStart,s=this.attributes.instanceEnd;if(t!==void 0&&s!==void 0){const i=this.boundingSphere.center;this.boundingBox.getCenter(i);let n=0;for(let r=0,a=t.count;r<a;r++)H.fromBufferAttribute(t,r),n=Math.max(n,i.distanceToSquared(H)),H.fromBufferAttribute(s,r),n=Math.max(n,i.distanceToSquared(H));this.boundingSphere.radius=Math.sqrt(n),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(t){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(t)}}class je extends Z{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(t){const s=t.length-3,i=new Float32Array(2*s);for(let n=0;n<s;n+=3)i[2*n]=t[n],i[2*n+1]=t[n+1],i[2*n+2]=t[n+2],i[2*n+3]=t[n+3],i[2*n+4]=t[n+4],i[2*n+5]=t[n+5];return super.setPositions(i),this}setColors(t,s=3){const i=t.length-s,n=new Float32Array(2*i);if(s===3)for(let r=0;r<i;r+=s)n[2*r]=t[r],n[2*r+1]=t[r+1],n[2*r+2]=t[r+2],n[2*r+3]=t[r+3],n[2*r+4]=t[r+4],n[2*r+5]=t[r+5];else for(let r=0;r<i;r+=s)n[2*r]=t[r],n[2*r+1]=t[r+1],n[2*r+2]=t[r+2],n[2*r+3]=t[r+3],n[2*r+4]=t[r+4],n[2*r+5]=t[r+5],n[2*r+6]=t[r+6],n[2*r+7]=t[r+7];return super.setColors(n,s),this}fromLine(t){const s=t.geometry;return this.setPositions(s.attributes.position.array),this}}class ee extends xe{constructor(t){super({type:"LineMaterial",uniforms:ie.clone(ie.merge([ne.common,ne.fog,{worldUnits:{value:1},linewidth:{value:1},resolution:{value:new be(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}}])),vertexShader:`
				#include <common>
				#include <fog_pars_vertex>
				#include <logdepthbuf_pars_vertex>
				#include <clipping_planes_pars_vertex>

				uniform float linewidth;
				uniform vec2 resolution;

				attribute vec3 instanceStart;
				attribute vec3 instanceEnd;

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
						attribute vec4 instanceColorStart;
						attribute vec4 instanceColorEnd;
					#else
						varying vec3 vLineColor;
						attribute vec3 instanceColorStart;
						attribute vec3 instanceColorEnd;
					#endif
				#endif

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#ifdef USE_DASH

					uniform float dashScale;
					attribute float instanceDistanceStart;
					attribute float instanceDistanceEnd;
					varying float vLineDistance;

				#endif

				void trimSegment( const in vec4 start, inout vec4 end ) {

					// trim end segment so it terminates between the camera plane and the near plane

					// conservative estimate of the near plane
					float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
					float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column
					float nearEstimate = - 0.5 * b / a;

					float alpha = ( nearEstimate - start.z ) / ( end.z - start.z );

					end.xyz = mix( start.xyz, end.xyz, alpha );

				}

				void main() {

					#ifdef USE_COLOR

						vLineColor = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

					#endif

					#ifdef USE_DASH

						vLineDistance = ( position.y < 0.5 ) ? dashScale * instanceDistanceStart : dashScale * instanceDistanceEnd;
						vUv = uv;

					#endif

					float aspect = resolution.x / resolution.y;

					// camera space
					vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
					vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

					#ifdef WORLD_UNITS

						worldStart = start.xyz;
						worldEnd = end.xyz;

					#else

						vUv = uv;

					#endif

					// special case for perspective projection, and segments that terminate either in, or behind, the camera plane
					// clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
					// but we need to perform ndc-space calculations in the shader, so we must address this issue directly
					// perhaps there is a more elegant solution -- WestLangley

					bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

					if ( perspective ) {

						if ( start.z < 0.0 && end.z >= 0.0 ) {

							trimSegment( start, end );

						} else if ( end.z < 0.0 && start.z >= 0.0 ) {

							trimSegment( end, start );

						}

					}

					// clip space
					vec4 clipStart = projectionMatrix * start;
					vec4 clipEnd = projectionMatrix * end;

					// ndc space
					vec3 ndcStart = clipStart.xyz / clipStart.w;
					vec3 ndcEnd = clipEnd.xyz / clipEnd.w;

					// direction
					vec2 dir = ndcEnd.xy - ndcStart.xy;

					// account for clip-space aspect ratio
					dir.x *= aspect;
					dir = normalize( dir );

					#ifdef WORLD_UNITS

						// get the offset direction as perpendicular to the view vector
						vec3 worldDir = normalize( end.xyz - start.xyz );
						vec3 offset;
						if ( position.y < 0.5 ) {

							offset = normalize( cross( start.xyz, worldDir ) );

						} else {

							offset = normalize( cross( end.xyz, worldDir ) );

						}

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						float forwardOffset = dot( worldDir, vec3( 0.0, 0.0, 1.0 ) );

						// don't extend the line if we're rendering dashes because we
						// won't be rendering the endcaps
						#ifndef USE_DASH

							// extend the line bounds to encompass  endcaps
							start.xyz += - worldDir * linewidth * 0.5;
							end.xyz += worldDir * linewidth * 0.5;

							// shift the position of the quad so it hugs the forward edge of the line
							offset.xy -= dir * forwardOffset;
							offset.z += 0.5;

						#endif

						// endcaps
						if ( position.y > 1.0 || position.y < 0.0 ) {

							offset.xy += dir * 2.0 * forwardOffset;

						}

						// adjust for linewidth
						offset *= linewidth * 0.5;

						// set the world position
						worldPos = ( position.y < 0.5 ) ? start : end;
						worldPos.xyz += offset;

						// project the worldpos
						vec4 clip = projectionMatrix * worldPos;

						// shift the depth of the projected points so the line
						// segments overlap neatly
						vec3 clipPose = ( position.y < 0.5 ) ? ndcStart : ndcEnd;
						clip.z = clipPose.z * clip.w;

					#else

						vec2 offset = vec2( dir.y, - dir.x );
						// undo aspect ratio adjustment
						dir.x /= aspect;
						offset.x /= aspect;

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						// endcaps
						if ( position.y < 0.0 ) {

							offset += - dir;

						} else if ( position.y > 1.0 ) {

							offset += dir;

						}

						// adjust for linewidth
						offset *= linewidth;

						// adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
						offset /= resolution.y;

						// select end
						vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

						// back to clip space
						offset *= clip.w;

						clip.xy += offset;

					#endif

					gl_Position = clip;

					vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

					#include <logdepthbuf_vertex>
					#include <clipping_planes_vertex>
					#include <fog_vertex>

				}
			`,fragmentShader:`
				uniform vec3 diffuse;
				uniform float opacity;
				uniform float linewidth;

				#ifdef USE_DASH

					uniform float dashOffset;
					uniform float dashSize;
					uniform float gapSize;

				#endif

				varying float vLineDistance;

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#include <common>
				#include <fog_pars_fragment>
				#include <logdepthbuf_pars_fragment>
				#include <clipping_planes_pars_fragment>

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
					#else
						varying vec3 vLineColor;
					#endif
				#endif

				vec2 closestLineToLine(vec3 p1, vec3 p2, vec3 p3, vec3 p4) {

					float mua;
					float mub;

					vec3 p13 = p1 - p3;
					vec3 p43 = p4 - p3;

					vec3 p21 = p2 - p1;

					float d1343 = dot( p13, p43 );
					float d4321 = dot( p43, p21 );
					float d1321 = dot( p13, p21 );
					float d4343 = dot( p43, p43 );
					float d2121 = dot( p21, p21 );

					float denom = d2121 * d4343 - d4321 * d4321;

					float numer = d1343 * d4321 - d1321 * d4343;

					mua = numer / denom;
					mua = clamp( mua, 0.0, 1.0 );
					mub = ( d1343 + d4321 * ( mua ) ) / d4343;
					mub = clamp( mub, 0.0, 1.0 );

					return vec2( mua, mub );

				}

				void main() {

					#include <clipping_planes_fragment>

					#ifdef USE_DASH

						if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

						if ( mod( vLineDistance + dashOffset, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

					#endif

					float alpha = opacity;

					#ifdef WORLD_UNITS

						// Find the closest points on the view ray and the line segment
						vec3 rayEnd = normalize( worldPos.xyz ) * 1e5;
						vec3 lineDir = worldEnd - worldStart;
						vec2 params = closestLineToLine( worldStart, worldEnd, vec3( 0.0, 0.0, 0.0 ), rayEnd );

						vec3 p1 = worldStart + lineDir * params.x;
						vec3 p2 = rayEnd * params.y;
						vec3 delta = p1 - p2;
						float len = length( delta );
						float norm = len / linewidth;

						#ifndef USE_DASH

							#ifdef USE_ALPHA_TO_COVERAGE

								float dnorm = fwidth( norm );
								alpha = 1.0 - smoothstep( 0.5 - dnorm, 0.5 + dnorm, norm );

							#else

								if ( norm > 0.5 ) {

									discard;

								}

							#endif

						#endif

					#else

						#ifdef USE_ALPHA_TO_COVERAGE

							// artifacts appear on some hardware if a derivative is taken within a conditional
							float a = vUv.x;
							float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
							float len2 = a * a + b * b;
							float dlen = fwidth( len2 );

							if ( abs( vUv.y ) > 1.0 ) {

								alpha = 1.0 - smoothstep( 1.0 - dlen, 1.0 + dlen, len2 );

							}

						#else

							if ( abs( vUv.y ) > 1.0 ) {

								float a = vUv.x;
								float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
								float len2 = a * a + b * b;

								if ( len2 > 1.0 ) discard;

							}

						#endif

					#endif

					vec4 diffuseColor = vec4( diffuse, alpha );
					#ifdef USE_COLOR
						#ifdef USE_LINE_COLOR_ALPHA
							diffuseColor *= vLineColor;
						#else
							diffuseColor.rgb *= vLineColor;
						#endif
					#endif

					#include <logdepthbuf_fragment>

					gl_FragColor = diffuseColor;

					#include <tonemapping_fragment>
					#include <${ye>=154?"colorspace_fragment":"encodings_fragment"}>
					#include <fog_fragment>
					#include <premultiplied_alpha_fragment>

				}
			`,clipping:!0}),this.isLineMaterial=!0,this.onBeforeCompile=function(){this.transparent?this.defines.USE_LINE_COLOR_ALPHA="1":delete this.defines.USE_LINE_COLOR_ALPHA},Object.defineProperties(this,{color:{enumerable:!0,get:function(){return this.uniforms.diffuse.value},set:function(s){this.uniforms.diffuse.value=s}},worldUnits:{enumerable:!0,get:function(){return"WORLD_UNITS"in this.defines},set:function(s){s===!0?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}},linewidth:{enumerable:!0,get:function(){return this.uniforms.linewidth.value},set:function(s){this.uniforms.linewidth.value=s}},dashed:{enumerable:!0,get:function(){return"USE_DASH"in this.defines},set(s){!!s!="USE_DASH"in this.defines&&(this.needsUpdate=!0),s===!0?this.defines.USE_DASH="":delete this.defines.USE_DASH}},dashScale:{enumerable:!0,get:function(){return this.uniforms.dashScale.value},set:function(s){this.uniforms.dashScale.value=s}},dashSize:{enumerable:!0,get:function(){return this.uniforms.dashSize.value},set:function(s){this.uniforms.dashSize.value=s}},dashOffset:{enumerable:!0,get:function(){return this.uniforms.dashOffset.value},set:function(s){this.uniforms.dashOffset.value=s}},gapSize:{enumerable:!0,get:function(){return this.uniforms.gapSize.value},set:function(s){this.uniforms.gapSize.value=s}},opacity:{enumerable:!0,get:function(){return this.uniforms.opacity.value},set:function(s){this.uniforms.opacity.value=s}},resolution:{enumerable:!0,get:function(){return this.uniforms.resolution.value},set:function(s){this.uniforms.resolution.value.copy(s)}},alphaToCoverage:{enumerable:!0,get:function(){return"USE_ALPHA_TO_COVERAGE"in this.defines},set:function(s){!!s!="USE_ALPHA_TO_COVERAGE"in this.defines&&(this.needsUpdate=!0),s===!0?(this.defines.USE_ALPHA_TO_COVERAGE="",this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1)}}}),this.setValues(t)}}const $=new B,ae=new M,le=new M,S=new B,_=new B,L=new B,q=new M,Q=new Pe,N=new Ue,ce=new M,F=new K,W=new me,A=new B;let C,k;function de(o,t,s){return A.set(0,0,-t,1).applyMatrix4(o.projectionMatrix),A.multiplyScalar(1/A.w),A.x=k/s.width,A.y=k/s.height,A.applyMatrix4(o.projectionMatrixInverse),A.multiplyScalar(1/A.w),Math.abs(Math.max(A.x,A.y))}function rt(o,t){const s=o.matrixWorld,i=o.geometry,n=i.attributes.instanceStart,r=i.attributes.instanceEnd,a=Math.min(i.instanceCount,n.count);for(let c=0,u=a;c<u;c++){N.start.fromBufferAttribute(n,c),N.end.fromBufferAttribute(r,c),N.applyMatrix4(s);const f=new M,h=new M;C.distanceSqToSegment(N.start,N.end,h,f),h.distanceTo(f)<k*.5&&t.push({point:h,pointOnLine:f,distance:C.origin.distanceTo(h),object:o,face:null,faceIndex:c,uv:null,[we]:null})}}function ot(o,t,s){const i=t.projectionMatrix,r=o.material.resolution,a=o.matrixWorld,c=o.geometry,u=c.attributes.instanceStart,f=c.attributes.instanceEnd,h=Math.min(c.instanceCount,u.count),m=-t.near;C.at(1,L),L.w=1,L.applyMatrix4(t.matrixWorldInverse),L.applyMatrix4(i),L.multiplyScalar(1/L.w),L.x*=r.x/2,L.y*=r.y/2,L.z=0,q.copy(L),Q.multiplyMatrices(t.matrixWorldInverse,a);for(let x=0,b=h;x<b;x++){if(S.fromBufferAttribute(u,x),_.fromBufferAttribute(f,x),S.w=1,_.w=1,S.applyMatrix4(Q),_.applyMatrix4(Q),S.z>m&&_.z>m)continue;if(S.z>m){const l=S.z-_.z,v=(S.z-m)/l;S.lerp(_,v)}else if(_.z>m){const l=_.z-S.z,v=(_.z-m)/l;_.lerp(S,v)}S.applyMatrix4(i),_.applyMatrix4(i),S.multiplyScalar(1/S.w),_.multiplyScalar(1/_.w),S.x*=r.x/2,S.y*=r.y/2,_.x*=r.x/2,_.y*=r.y/2,N.start.copy(S),N.start.z=0,N.end.copy(_),N.end.z=0;const w=N.closestPointToPointParameter(q,!0);N.at(w,ce);const p=Be.lerp(S.z,_.z,w),E=p>=-1&&p<=1,g=q.distanceTo(ce)<k*.5;if(E&&g){N.start.fromBufferAttribute(u,x),N.end.fromBufferAttribute(f,x),N.start.applyMatrix4(a),N.end.applyMatrix4(a);const l=new M,v=new M;C.distanceSqToSegment(N.start,N.end,v,l),s.push({point:v,pointOnLine:l,distance:C.origin.distanceTo(v),object:o,face:null,faceIndex:x,uv:null,[we]:null})}}}class Se extends ke{constructor(t=new Z,s=new ee({color:Math.random()*16777215})){super(t,s),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){const t=this.geometry,s=t.attributes.instanceStart,i=t.attributes.instanceEnd,n=new Float32Array(2*s.count);for(let a=0,c=0,u=s.count;a<u;a++,c+=2)ae.fromBufferAttribute(s,a),le.fromBufferAttribute(i,a),n[c]=c===0?0:n[c-1],n[c+1]=n[c]+ae.distanceTo(le);const r=new X(n,2,1);return t.setAttribute("instanceDistanceStart",new U(r,1,0)),t.setAttribute("instanceDistanceEnd",new U(r,1,1)),this}raycast(t,s){const i=this.material.worldUnits,n=t.camera;n===null&&!i&&console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');const r=t.params.Line2!==void 0&&t.params.Line2.threshold||0;C=t.ray;const a=this.matrixWorld,c=this.geometry,u=this.material;k=u.linewidth+r,c.boundingSphere===null&&c.computeBoundingSphere(),W.copy(c.boundingSphere).applyMatrix4(a);let f;if(i)f=k*.5;else{const m=Math.max(n.near,W.distanceToPoint(C.origin));f=de(n,m,u.resolution)}if(W.radius+=f,C.intersectsSphere(W)===!1)return;c.boundingBox===null&&c.computeBoundingBox(),F.copy(c.boundingBox).applyMatrix4(a);let h;if(i)h=k*.5;else{const m=Math.max(n.near,F.distanceToPoint(C.origin));h=de(n,m,u.resolution)}F.expandByScalar(h),C.intersectsBox(F)!==!1&&(i?rt(this,s):ot(this,n,s))}onBeforeRender(t){const s=this.material.uniforms;s&&s.resolution&&(t.getViewport($),this.material.uniforms.resolution.value.set($.z,$.w))}}class at extends Se{constructor(t=new je,s=new ee({color:Math.random()*16777215})){super(t,s),this.isLine2=!0,this.type="Line2"}}const lt=d.forwardRef(function({points:t,color:s=16777215,vertexColors:i,linewidth:n,lineWidth:r,segments:a,dashed:c,...u},f){var h,m;const x=P(E=>E.size),b=d.useMemo(()=>a?new Se:new at,[a]),[y]=d.useState(()=>new ee),w=(i==null||(h=i[0])==null?void 0:h.length)===4?4:3,p=d.useMemo(()=>{const E=a?new Z:new je,g=t.map(l=>{const v=Array.isArray(l);return l instanceof M||l instanceof B?[l.x,l.y,l.z]:l instanceof be?[l.x,l.y,0]:v&&l.length===3?[l[0],l[1],l[2]]:v&&l.length===2?[l[0],l[1],0]:l});if(E.setPositions(g.flat()),i){s=16777215;const l=i.map(v=>v instanceof ve?v.toArray():v);E.setColors(l.flat(),w)}return E},[t,a,i,w]);return d.useLayoutEffect(()=>{b.computeLineDistances()},[t,b]),d.useLayoutEffect(()=>{c?y.defines.USE_DASH="":delete y.defines.USE_DASH,y.needsUpdate=!0},[c,y]),d.useEffect(()=>()=>{p.dispose(),y.dispose()},[p]),d.createElement("primitive",Y({object:b,ref:f},u),d.createElement("primitive",{object:p,attach:"geometry"}),d.createElement("primitive",Y({object:y,attach:"material",color:s,vertexColors:!!i,resolution:[x.width,x.height],linewidth:(m=n??r)!==null&&m!==void 0?m:1,dashed:c,transparent:w===4},u)))}),ct=()=>parseInt(he.replace(/\D+/g,"")),dt=ct();function ut(o,t,s){const i=P(b=>b.size),n=P(b=>b.viewport),r=typeof o=="number"?o:i.width*n.dpr,a=i.height*n.dpr,c=(typeof o=="number"?s:o)||{},{samples:u=0,depth:f,...h}=c,m=f??c.depthBuffer,x=d.useMemo(()=>{const b=new Oe(r,a,{minFilter:re,magFilter:re,type:Re,...h});return m&&(b.depthTexture=new De(r,a,Ie)),b.samples=u,b},[]);return d.useLayoutEffect(()=>{x.setSize(r,a),u&&(x.samples=u)},[u,x,r,a]),d.useEffect(()=>()=>x.dispose(),[]),x}const ft=o=>typeof o=="function",pt=d.forwardRef(({envMap:o,resolution:t=256,frames:s=1/0,makeDefault:i,children:n,...r},a)=>{const c=P(({set:p})=>p),u=P(({camera:p})=>p),f=P(({size:p})=>p),h=d.useRef(null);d.useImperativeHandle(a,()=>h.current,[]);const m=d.useRef(null),x=ut(t);d.useLayoutEffect(()=>{r.manual||(h.current.aspect=f.width/f.height)},[f,r]),d.useLayoutEffect(()=>{h.current.updateProjectionMatrix()});let b=0,y=null;const w=ft(n);return V(p=>{w&&(s===1/0||b<s)&&(m.current.visible=!1,p.gl.setRenderTarget(x),y=p.scene.background,o&&(p.scene.background=o),p.gl.render(p.scene,h.current),p.scene.background=y,p.gl.setRenderTarget(null),m.current.visible=!0,b++)}),d.useLayoutEffect(()=>{if(i){const p=u;return c(()=>({camera:h.current})),()=>c(()=>({camera:p}))}},[h,i,c]),d.createElement(d.Fragment,null,d.createElement("perspectiveCamera",Y({ref:h},r),!w&&n),d.createElement("group",{ref:m},w&&n(x.texture)))});class ht extends xe{constructor(){super({uniforms:{time:{value:0},fade:{value:1}},vertexShader:`
      uniform float time;
      attribute float size;
      varying vec3 vColor;
      void main() {
        vColor = color;
        vec4 mvPosition = modelViewMatrix * vec4(position, 0.5);
        gl_PointSize = size * (30.0 / -mvPosition.z) * (3.0 + sin(time + 100.0));
        gl_Position = projectionMatrix * mvPosition;
      }`,fragmentShader:`
      uniform sampler2D pointTexture;
      uniform float fade;
      varying vec3 vColor;
      void main() {
        float opacity = 1.0;
        if (fade == 1.0) {
          float d = distance(gl_PointCoord, vec2(0.5, 0.5));
          opacity = 1.0 / (1.0 + exp(16.0 * (d - 0.25)));
        }
        gl_FragColor = vec4(vColor, opacity);

        #include <tonemapping_fragment>
	      #include <${dt>=154?"colorspace_fragment":"encodings_fragment"}>
      }`})}}const mt=o=>new M().setFromSpherical(new He(o,Math.acos(1-Math.random()*2),Math.random()*2*Math.PI)),xt=d.forwardRef(({radius:o=100,depth:t=50,count:s=5e3,saturation:i=0,factor:n=4,fade:r=!1,speed:a=1},c)=>{const u=d.useRef(null),[f,h,m]=d.useMemo(()=>{const b=[],y=[],w=Array.from({length:s},()=>(.5+.5*Math.random())*n),p=new ve;let E=o+t;const g=t/s;for(let l=0;l<s;l++)E-=g*Math.random(),b.push(...mt(E).toArray()),p.setHSL(l/s,i,.9),y.push(p.r,p.g,p.b);return[new Float32Array(b),new Float32Array(y),new Float32Array(w)]},[s,t,n,o,i]);V(b=>u.current&&(u.current.uniforms.time.value=b.clock.elapsedTime*a));const[x]=d.useState(()=>new ht);return d.createElement("points",{ref:c},d.createElement("bufferGeometry",null,d.createElement("bufferAttribute",{attach:"attributes-position",args:[f,3]}),d.createElement("bufferAttribute",{attach:"attributes-color",args:[h,3]}),d.createElement("bufferAttribute",{attach:"attributes-size",args:[m,1]})),d.createElement("primitive",{ref:u,object:x,attach:"material",blending:ge,"uniforms-fade-value":r,depthWrite:!1,transparent:!0,vertexColors:!0}))}),bt=({value:o,className:t})=>e.jsx("div",{className:`flex overflow-hidden ${t}`,children:o.toString().split("").map((s,i)=>e.jsx(vt,{digit:s},i))}),vt=({digit:o})=>{const[t,s]=d.useState(o);return d.useEffect(()=>{o!==t&&s(o)},[o]),e.jsx("div",{className:"relative h-[1em] w-[0.6em] flex justify-center",children:e.jsx(_e,{mode:"popLayout",children:e.jsx(fe.span,{initial:{y:"100%",opacity:0,filter:"blur(2px)"},animate:{y:"0%",opacity:1,filter:"blur(0px)"},exit:{y:"-100%",opacity:0,filter:"blur(2px)"},transition:{type:"spring",stiffness:300,damping:30},className:"absolute",children:o},o)})})},gt=(o,t,s)=>{const i=[];if(!o||t.length===0)return i;const n=t.filter(l=>l.userId===o.name);if(n.length===0)return[{id:"new",label:"НОВЫЙ СУБЪЕКТ",description:"No data yet",color:"text-white/50"}];const r=n.length,a={},c={};n.forEach(l=>{a[l.cluster]=(a[l.cluster]||0)+1,c[l.cluster]=(c[l.cluster]||0)+(l.cognitiveLoad||0)});const u=Object.entries(a).sort((l,v)=>v[1]-l[1])[0],f=u?u[1]/r:0;Object.keys(a).filter(l=>a[l]>r*.15).length>=3&&i.push({id:"connector",label:"СВЯЗНОЙ КООРДИНАТОР",description:"Active in 3+ clusters",color:"text-pink-400"}),u&&u[0]==="Science"&&f>.8&&i.push({id:"purist",label:"НАУЧНЫЙ СОТРУДНИК",description:">80% Science",color:"text-cyan-400"}),u&&u[0]==="Politics"&&f>.4&&i.push({id:"strategist",label:"ПОЛИТИЧЕСКИЙ ТЕХНОЛОГ",description:"High Politics activity",color:"text-red-400"}),u&&u[0]==="Technology"&&f>.5&&i.push({id:"evangelist",label:"ТЕХНИЧЕСКИЙ ЭКСПЕРТ",description:"High Technology activity",color:"text-blue-400"}),u&&u[0]==="Economics"&&f>.5&&i.push({id:"allocator",label:"ЭКОНОМИЧЕСКИЙ АГЕНТ",description:"High Economics activity",color:"text-yellow-400"});const m=a.Art||0,x=a.Society||0;(m+x)/r>.5&&i.push({id:"architect",label:"КУЛЬТУРНЫЙ ДЕЯТЕЛЬ",description:"Dominant Art/Society",color:"text-purple-400"});const b=n.filter(l=>l.evidenceLevel==="Low").length;b/r>.6&&i.push({id:"observer",label:"НАБЛЮДАТЕЛЬ",description:"High Low-Evidence events",color:"text-gray-400"}),n.filter(l=>(l.cognitiveLoad||0)>7).length/r>.3&&i.push({id:"instigator",label:"ИНИЦИАТОР АКТИВНОСТИ",description:"Frequent high cognitive load",color:"text-orange-500"}),f<.3&&i.push({id:"nomad",label:"МОБИЛЬНЫЙ СУБЪЕКТ",description:"No dominant cluster",color:"text-emerald-300"}),f>.9&&i.push({id:"specialist",label:"ПРОФИЛЬНЫЙ СПЕЦИАЛИСТ",description:">90% single cluster",color:"text-indigo-400"}),n.filter(l=>(l.latency||0)<30).length/r>.4&&i.push({id:"gossip",label:"УЗЕЛ РАСПРОСТРАНЕНИЯ",description:"High frequency low latency",color:"text-yellow-200"});const p=n.filter(l=>(l.latency||0)>100).length;p/r>.4&&i.push({id:"deep_diver",label:"ЭКСПЕРТ-АНАЛИТИК",description:"High latency interactions",color:"text-blue-800"});let E=0;n.slice(0,20).forEach(l=>{const v=s.find(O=>O.name===l.cluster);v&&v.activeUnits>500&&E++}),E>10&&i.push({id:"trend",label:"УЧАСТНИК ТРЕНДОВ",description:"Follows high activity",color:"text-green-400"});let g=0;return n.slice(0,20).forEach(l=>{const v=s.find(O=>O.name===l.cluster);v&&v.activeUnits<300&&g++}),g>10&&i.push({id:"contrarian",label:"НЕЗАВИСИМЫЙ ОЦЕНЩИК",description:"Seeks low activity zones",color:"text-rose-400"}),b/r>.8&&p>0&&i.push({id:"ghost",label:"СКРЫТЫЙ ПРОФИЛЬ",description:"Minimal trace",color:"text-white/10"}),i.slice(0,4)},ue=6,T=[{name:"Education",color:z.Education,angle:0},{name:"HealthyLifestyle",color:z.HealthyLifestyle,angle:60},{name:"Labor",color:z.Labor,angle:120},{name:"Culture",color:z.Culture,angle:180},{name:"Volunteering",color:z.Volunteering,angle:240},{name:"Patriotism",color:z.Patriotism,angle:300}],D=o=>{const t=o*Math.PI/180;return new M(Math.cos(t)*ue,0,Math.sin(t)*ue)},yt=(o,t)=>{if(!Array.isArray(o))return 0;const s=o.find(i=>i.name===t);return s?Math.min(s.activeUnits/500,1):0},wt=({position:o,color:t,label:s,load:i})=>{const n=Math.round(i*100),r=Math.max(.1,i*4);return e.jsxs("group",{position:o,children:[e.jsxs("mesh",{rotation:[-Math.PI/2,0,0],children:[e.jsx("ringGeometry",{args:[1,1.05,64]}),e.jsx("meshBasicMaterial",{color:t,transparent:!0,opacity:.5,side:We})]}),e.jsxs(Ce,{speed:2,rotationIntensity:.2,floatIntensity:.5,children:[e.jsxs("mesh",{position:[0,r/2,0],children:[e.jsx("boxGeometry",{args:[.8,r,.8]}),e.jsx("meshPhysicalMaterial",{color:t,transparent:!0,roughness:.1,metalness:.1,transmission:.9,thickness:1,emissive:t,emissiveIntensity:.2})]}),e.jsxs("mesh",{position:[0,r/2,0],children:[e.jsx("boxGeometry",{args:[.4,r*.8,.4]}),e.jsx("meshStandardMaterial",{color:"white",emissive:t,emissiveIntensity:2})]}),e.jsxs("mesh",{position:[0,2.5,0],children:[e.jsx("cylinderGeometry",{args:[.02,.02,5,8]}),e.jsx("meshBasicMaterial",{color:t,transparent:!0,opacity:.2,blending:ge})]})]}),e.jsxs("group",{position:[0,4.5,0],children:[e.jsx(te,{fontSize:.4,color:"white",anchorX:"center",anchorY:"bottom",outlineWidth:.02,outlineColor:"black",children:J[s]||s}),n>0&&e.jsxs(te,{position:[0,-.3,0],fontSize:.25,color:t,anchorX:"center",anchorY:"top",children:[n,"% LOAD"]})]})]})},jt=({start:o,end:t,weight:s,color:i})=>{const n=d.useMemo(()=>{const a=new M().addVectors(o,t).multiplyScalar(.5);return a.y+=3+s*4,new Ge(o,a,t).getPoints(20)},[o,t,s]),r=d.useRef(null);return V(()=>{r.current&&(r.current.material.dashOffset-=.01*(1+s))}),e.jsx(lt,{ref:r,points:n,color:i,lineWidth:Math.max(1,s*3),dashed:!0,dashScale:2,dashSize:.5,dashOffset:0,opacity:.6+s*.4,transparent:!0})},St=({start:o,end:t,color:s})=>{const i=d.useRef(null),n=.5+Math.random()*.5,r=Math.random()*100;return V(a=>{if(!i.current)return;const u=(a.clock.getElapsedTime()*n+r)%1,f=new M().lerpVectors(o,t,u);f.y+=Math.sin(u*Math.PI)*3,i.current.position.copy(f);const h=Math.sin(u*Math.PI)*1.5;i.current.scale.setScalar(h)}),e.jsxs("mesh",{ref:i,children:[e.jsx("sphereGeometry",{args:[.08,8,8]}),e.jsx("meshBasicMaterial",{color:s,toneMapped:!1})]})},_t=()=>{const o=d.useMemo(()=>Array.from({length:20}).map((t,s)=>{const i=T[Math.floor(Math.random()*T.length)];let n=T[Math.floor(Math.random()*T.length)];for(;i===n;)n=T[Math.floor(Math.random()*T.length)];return{id:s,start:D(i.angle),end:D(n.angle),color:i.color}}),[]);return e.jsx("group",{children:o.map(t=>e.jsx(St,{...t},t.id))})},Nt=({clusterMetrics:o=[],graphStats:t})=>e.jsxs("div",{className:"w-full h-full relative",children:[e.jsxs(Le,{gl:{antialias:!0,toneMapping:Fe},dpr:[1,2],children:[e.jsx(pt,{makeDefault:!0,position:[10,12,14],fov:45}),e.jsx(Ae,{enablePan:!1,autoRotate:!0,autoRotateSpeed:.5,minPolarAngle:Math.PI/4,maxPolarAngle:Math.PI/2.1}),e.jsx("ambientLight",{intensity:.5}),e.jsx("pointLight",{position:[10,10,10],intensity:2,color:"#4f46e5"}),e.jsx("pointLight",{position:[-10,10,-10],intensity:2,color:"#ec4899"}),e.jsx(xt,{radius:100,depth:50,count:5e3,factor:4,saturation:0,fade:!0,speed:1}),e.jsx(d.Suspense,{fallback:null,children:e.jsxs("group",{position:[0,-1,0],children:[T.map(s=>e.jsx(wt,{position:D(s.angle),color:s.color,label:s.name,load:yt(o,s.name)},s.name)),t?.edges?.map((s,i)=>{const n=T.find(a=>a.name===s.source),r=T.find(a=>a.name===s.target);return!n||!r?null:e.jsx(jt,{start:D(n.angle),end:D(r.angle),weight:s.weight,color:n.color},`edge-${i}`)}),e.jsx(_t,{}),e.jsx("gridHelper",{args:[40,40,"#222","#050505"],position:[0,-.01,0]}),e.jsxs("mesh",{rotation:[-Math.PI/2,0,0],position:[0,-.02,0],children:[e.jsx("circleGeometry",{args:[20]}),e.jsx("meshBasicMaterial",{color:"#000000",opacity:.8,transparent:!0})]})]})})]}),e.jsx("div",{className:"absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]"})]}),Et=()=>e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-blue-500/40 z-10"}),e.jsx("div",{className:"absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-blue-500/40 z-10"}),e.jsx("div",{className:"absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-blue-500/40 z-10"}),e.jsx("div",{className:"absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-blue-500/40 z-10"})]}),Mt=({user:o,selectedRow:t,stats:s,insights:i})=>{const[n,r]=d.useState("0x"+Math.random().toString(16).substr(2,8).toUpperCase());return Me.useEffect(()=>{const a=setInterval(()=>{r("0x"+Math.random().toString(16).substr(2,8).toUpperCase())},5e3);return()=>clearInterval(a)},[]),o?e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"glass-card-2 p-5 relative overflow-hidden group/card shadow-[0_0_30px_rgba(0,0,0,0.6)] flex flex-col gap-4",children:[e.jsx("div",{className:"absolute inset-0 bg-hex-pattern opacity-10 pointer-events-none"}),e.jsx("div",{className:"absolute inset-0 bg-grain opacity-0 group-hover/card:opacity-10 transition-opacity pointer-events-none"}),e.jsx("div",{className:"absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-blue-500/50 z-20 opacity-60 group-hover/card:opacity-100 transition-opacity"}),e.jsx("div",{className:"absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-blue-500/50 z-20 opacity-60 group-hover/card:opacity-100 transition-opacity"}),e.jsxs("div",{className:"flex justify-between items-start relative z-10",children:[e.jsxs("div",{className:"flex flex-col gap-1",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("div",{className:"w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_#3b82f6]"}),e.jsx("span",{className:"text-[9px] font-mono text-blue-500/60 uppercase tracking-widest",children:t?"РУЧНОЙ ФОКУС":"АВТО-СЛЕЖЕНИЕ"})]}),e.jsx("h4",{className:"text-[16px] font-black text-white truncate drop-shadow-[0_0_5px_rgba(59,130,246,0.5)]",children:o.name}),e.jsxs("span",{className:"px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-[9px] text-blue-400 uppercase tracking-widest font-black rounded w-fit",children:[o.role," // ",o.age," ЛЕТ"]})]}),e.jsxs("div",{className:"text-right shrink-0 bg-black/40 p-2 rounded border border-white/5",children:[e.jsx("div",{className:"text-[7px] font-mono text-white/30 uppercase mb-1 border-b border-white/5 pb-1",children:"ХЭШ СЕССИИ"}),e.jsx("div",{className:"text-[9px] font-mono text-blue-300/80",children:n})]})]}),e.jsxs("div",{className:"h-[140px] w-full flex justify-center items-center overflow-hidden relative z-10 -mx-2 mt-2 bg-blue-500/[0.02] rounded-lg border border-white/5",children:[e.jsx("div",{className:"absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1),transparent_70%)] opacity-50"}),e.jsx("div",{className:"w-[300px] h-[160px] shrink-0 relative z-20",children:e.jsxs(Ve,{cx:"50%",cy:"50%",outerRadius:"70%",data:s,width:300,height:160,children:[e.jsx($e,{stroke:"#ffffff15"}),e.jsx(qe,{dataKey:"subject",tick:{fill:"#ffffff60",fontSize:9,fontWeight:700}}),e.jsx(Qe,{name:"Stats",dataKey:"A",stroke:"#3b82f6",fill:"#3b82f6",fillOpacity:.4})]})})]})]}),e.jsxs("div",{className:"space-y-3 relative z-10 w-full overflow-hidden",children:[e.jsxs("div",{className:"text-[9px] font-black text-white/40 uppercase tracking-[0.2em] flex items-center justify-between mb-2",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(pe,{size:10,className:"text-blue-500 animate-pulse"}),"АНАЛИЗ АКТИВНОСТИ"]}),e.jsxs("div",{className:"text-[8px] font-mono text-blue-400/60",children:["ТОЧНОСТЬ: ",(80+Math.random()*19).toFixed(1),"%"]})]}),e.jsxs("div",{className:"h-[24px] w-full bg-black/40 border border-blue-500/20 mb-2 relative overflow-hidden",children:[e.jsx("svg",{className:"w-full h-full",preserveAspectRatio:"none",children:e.jsx("path",{d:"M0,12 Q20,24 40,12 T80,12 T120,12 T160,12 T200,12 T240,12 T280,12 T320,12",fill:"none",stroke:"#3b82f6",strokeWidth:"1.5",vectorEffect:"non-scaling-stroke",className:"drop-shadow-[0_0_4px_#3b82f6] animate-[shiver_0.5s_infinite_linear]",children:e.jsx("animate",{attributeName:"d",values:`
                                    M0,12 Q20,24 40,12 T80,12 T120,12 T160,12 T200,12 T240,12 T280,12 T320,12;
                                    M0,12 Q20,0 40,12 T80,12 T120,12 T160,12 T200,12 T240,12 T280,12 T320,12;
                                    M0,12 Q20,24 40,12 T80,12 T120,12 T160,12 T200,12 T240,12 T280,12 T320,12
                                `,dur:"2s",repeatCount:"indefinite"})})}),e.jsx("div",{className:"absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(0,0,0,0.8))]"})]}),e.jsx("div",{className:"flex flex-col gap-3",children:i.length>0?i.slice(0,4).map((a,c)=>e.jsxs("div",{className:"glass-card-2 relative p-4 overflow-hidden group hover:border-blue-400/30 transition-all duration-300 animate-laser-sweep",style:{animationDelay:`${c*.1}s`,borderLeft:`2px solid ${a.color.replace("text-","").replace("-400","-500")}`},children:[e.jsx("div",{className:"absolute inset-0 bg-hex-pattern opacity-5 pointer-events-none"}),e.jsx("div",{className:"absolute inset-0 bg-grain opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none"}),e.jsxs("div",{className:"flex items-center justify-between mb-2 relative z-10",children:[e.jsx("div",{className:"text-[9px] font-mono text-white/40 uppercase tracking-[0.1em] group-hover:text-blue-400/80 transition-colors",children:"[ АНАЛИЗ_ИНСАЙТА ]"}),e.jsx("div",{className:"flex items-center gap-1.5",children:e.jsx("div",{className:`w-1.5 h-1.5 rounded-full animate-pulse ${a.id==="instigator"?"bg-red-500 shadow-[0_0_6px_#ef4444]":"bg-cyan-400 shadow-[0_0_6px_#22d3ee]"}`})})]}),e.jsxs("div",{className:"relative z-10",children:[e.jsx("div",{className:"text-[13px] font-medium leading-tight text-white group-hover:text-glow-blue transition-all duration-300 font-inter",children:a.label}),e.jsx("div",{className:"text-[10px] text-white/50 mt-1 font-mono hover:text-white/70",children:a.description}),e.jsx("div",{className:"absolute right-0 top-1/2 -translate-y-1/2 opacity-20 group-hover:opacity-40 transition-opacity pointer-events-none w-16 h-8",children:e.jsx("svg",{width:"100%",height:"100%",viewBox:"0 0 60 20",children:e.jsx("polyline",{points:"0,10 10,10 15,2 20,18 25,10 35,10 40,5 45,15 50,10 60,10",fill:"none",stroke:"currentColor",strokeWidth:"1.5",className:a.color})})})]}),e.jsxs("div",{className:"mt-3 flex items-center gap-3 relative z-10 border-t border-white/5 pt-2",children:[e.jsxs("div",{className:"flex items-center gap-1 text-[9px] text-white/30 font-mono",children:[e.jsx("div",{className:"w-1 h-1 bg-current rounded-full"}),e.jsx("span",{children:"ЭКОНОМИКА"})]}),e.jsx("div",{className:"text-white/20 text-[8px]",children:">"}),e.jsxs("div",{className:"flex items-center gap-1 text-[9px] text-white/30 font-mono",children:[e.jsx("div",{className:"w-1 h-1 bg-current rounded-full"}),e.jsx("span",{children:"ТЕХНОЛОГИИ"})]})]}),e.jsx("div",{className:"absolute top-0 right-0 w-2 h-2 border-t border-r border-blue-500/50 opacity-50 group-hover:opacity-100 transition-opacity"}),e.jsx("div",{className:"absolute bottom-0 left-0 w-2 h-2 border-b border-l border-blue-500/50 opacity-50 group-hover:opacity-100 transition-opacity"})]},a.id)):e.jsx("div",{className:"glass-card-2 p-4 text-center border-dashed border-white/10",children:e.jsx("div",{className:"text-[10px] text-white/20 italic uppercase font-mono animate-pulse",children:"Ожидание поступления данных..."})})})]})]}):null},Lt=({logs:o})=>e.jsxs("div",{className:"pt-6 border-t border-white/10",children:[e.jsxs("div",{className:"text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-4 flex items-center gap-2",children:[e.jsx(Ye,{size:10,className:"text-blue-500"}),"Статистика Узлов"]}),e.jsx("div",{className:"space-y-3",children:Object.entries(z).filter(([t])=>["Science","Technology","Economics","Society","Politics","Art"].includes(t)).map(([t,s])=>{const i=o.filter(c=>c.cluster===t).length,n=Math.max(...Object.keys(z).map(c=>o.filter(u=>u.cluster===c).length),1),r=i/n*100,a=Math.random()*20+10;return e.jsxs("div",{className:"group cursor-default",children:[e.jsxs("div",{className:"flex items-center justify-between mb-1",children:[e.jsxs("div",{className:"flex items-center gap-2 overflow-hidden",children:[e.jsx("div",{className:"w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor] shrink-0",style:{backgroundColor:s,color:s}}),e.jsxs("div",{className:"flex flex-col",children:[e.jsx("span",{className:"text-[10px] font-bold uppercase tracking-wider transition-colors truncate leading-none",style:{color:s},children:J[t]||t}),e.jsx("div",{className:"h-[2px] bg-white/10 w-full mt-0.5 relative overflow-hidden",children:e.jsx("div",{className:"absolute top-0 left-0 bottom-0 bg-current opacity-50",style:{width:`${a}%`,color:s}})})]})]}),e.jsx("span",{className:"text-[11px] font-black text-white tabular-nums min-w-[30px] text-right ml-2 font-mono",children:i.toString().padStart(2,"0")})]}),e.jsxs("div",{className:"h-[3px] w-full bg-white/5 rounded-full overflow-hidden relative",children:[e.jsx("div",{className:"absolute top-0 bottom-0 left-[80%] w-[1px] bg-red-500/50 z-10"}),e.jsx(fe.div,{className:"h-full opacity-60",style:{backgroundColor:s},initial:{width:0},animate:{width:`${r}%`},transition:{duration:1,ease:"easeOut"}})]})]},t)})})]}),At=({recentLogs:o,selectedRowId:t,onSelect:s})=>e.jsxs("div",{className:"relative overflow-hidden flex flex-col group min-h-0 min-w-0 flex-1 border-r border-blue-500/10 h-full",children:[e.jsx(Et,{}),e.jsxs("div",{className:"grid grid-cols-[80px_100px_100px_180px_1fr] gap-2 px-4 h-10 items-center border-b border-white/20 bg-white/5 text-[9px] font-black uppercase tracking-[0.2em] text-white/60 shrink-0",children:[e.jsx("div",{children:"ВРЕМЯ"}),e.jsx("div",{children:"СУБЪЕКТ"}),e.jsx("div",{children:"КЛАСТЕР"}),e.jsx("div",{children:"ДЕЙСТВИЕ"}),e.jsx("div",{children:"КОНТЕКСТ"})]}),e.jsxs("div",{className:"flex-1 overflow-y-auto no-scrollbar scroll-smooth relative min-h-0",children:[e.jsx("div",{className:"absolute inset-0 pointer-events-none z-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%),linear-gradient(90deg,rgba(0,0,255,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_2px,3px_100%] opacity-10"}),e.jsx("div",{className:"flex flex-col min-h-0",children:o.map((i,n)=>{const r=t===i.id,a=Math.max(1-n*.08,.4);return e.jsxs("div",{onClick:()=>s(i.id),className:G("grid grid-cols-[80px_100px_100px_180px_1fr] gap-2 px-4 h-10 border-b border-white/5 items-center cursor-pointer transition-all relative overflow-hidden shrink-0 group",r?"bg-blue-500/15":"hover:bg-blue-500/5"),style:{opacity:r?1:a},children:[e.jsx("div",{className:"text-[10px] tabular-nums text-blue-500/60 font-mono",children:new Date(i.timestamp).toLocaleTimeString([],{hour12:!1})}),e.jsx("div",{className:"font-bold text-white group-hover:text-blue-400 transition-colors truncate text-[10px]",children:i.userId.split(" ")[0]}),e.jsx("div",{className:"min-w-0",children:e.jsx("span",{className:"px-1.5 py-0.5 text-[8px] font-black uppercase rounded-[1px] text-black",style:{backgroundColor:z[i.cluster]},children:J[i.cluster]?.slice(0,10)||i.cluster})}),e.jsx("div",{className:"text-blue-200/90 font-black uppercase text-[9px] truncate",children:i.action}),e.jsx("div",{className:"text-white/40 italic text-[9px] truncate group-hover:text-white/60 transition-colors",children:i.zone}),r&&e.jsx("div",{className:"absolute left-0 top-0 bottom-0 w-[2px] bg-blue-500 shadow-[0_0_10px_#3b82f6]"})]},i.id)})})]})]}),Ot=()=>{const{logs:o,isPlaying:t,toggleSimulation:s,stepSimulation:i,simulationSpeed:n,setSimulationSpeed:r,selectableUsers:a,clusterMetrics:c,graphStats:u}=Ne(),[f,h]=d.useState(null),[m,x]=d.useState(null),y=d.useMemo(()=>f?o.filter(j=>j.cluster===f):o,[o,f]).slice(0,10),w=o.find(j=>j.id===m),p=d.useMemo(()=>w||y[0]||o[0],[w,y,o]),E=p?.cluster||null,g=d.useMemo(()=>a.find(j=>j.name===p?.userId)||a[0],[a,p]),l=d.useMemo(()=>g?gt(g,o,c):[],[g,o,c]),v=d.useMemo(()=>g?[{subject:"INT",A:g.stats.Education/10+20},{subject:"STR",A:g.stats.HealthyLifestyle/10+20},{subject:"AGI",A:g.stats.Labor/10+20},{subject:"SPI",A:g.stats.Culture/10+20},{subject:"END",A:g.stats.Volunteering/10+20},{subject:"LUK",A:g.stats.Patriotism/10+20}]:[],[g]),O=()=>{const j="data:text/json;charset=utf-8,"+encodeURIComponent(JSON.stringify(o)),R=document.createElement("a");R.setAttribute("href",j),R.setAttribute("download","telemetry_dump.json"),document.body.appendChild(R),R.click(),R.remove()};return e.jsxs("div",{className:"grid grid-rows-[44px_1fr_40vh_28px] h-full w-full bg-[#030303] text-white font-['JetBrains_Mono',monospace] border border-blue-500/20 relative overflow-hidden shadow-2xl",children:[e.jsx("div",{className:"absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"}),e.jsxs("div",{className:"flex items-center justify-between px-6 border-b border-blue-500/20 bg-black/40 backdrop-blur-md z-20 overflow-hidden shrink-0",children:[e.jsx("div",{className:"flex items-center gap-6",children:e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(pe,{size:18,className:"text-blue-500 animate-pulse"}),e.jsx("span",{className:"text-[11px] font-black uppercase tracking-[0.3em]",children:"Нейросетевая Телеметрия"})]})}),e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx("div",{className:"flex items-center gap-1 mr-4 border-r border-white/10 pr-4",children:[.5,1,2,4,6].map(j=>e.jsxs("button",{onClick:()=>r(j),className:G("w-8 h-5 flex items-center justify-center text-[9px] font-black transition-all border",n===j?"bg-blue-500/20 border-blue-500 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.3)]":"border-white/5 text-white/20 hover:text-white/40 hover:border-white/10"),children:[j,"X"]},j))}),e.jsxs("div",{className:"flex gap-2 mr-4 border-r border-white/10 pr-4",children:[e.jsx("button",{onClick:()=>h(null),className:G("px-2 py-0.5 text-[8px] font-black uppercase transition-all border",f===null?"bg-white/20 border-white/40 text-white":"border-white/10 text-white/40 hover:text-white"),children:"ВСЕ"}),["Science","Technology","Economics","Society","Politics","Art"].map(j=>e.jsx("button",{onClick:()=>h(f===j?null:j),className:G("px-2 py-0.5 text-[8px] font-black uppercase transition-all border",f===j?"bg-blue-500 border-blue-400 text-white":"border-white/10 text-white/40 hover:text-white"),children:j.slice(0,3)},j))]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("button",{onClick:O,className:"p-1.5 hover:bg-white/5 rounded text-white/40 hover:text-white",title:"Export Raw",children:e.jsx(Ke,{size:14})}),e.jsx("button",{onClick:i,className:"p-1.5 hover:bg-white/5 rounded text-white/40 hover:text-white",title:"Step",children:e.jsx(nt,{size:14})}),e.jsx("button",{onClick:s,className:"p-1.5 hover:bg-white/5 rounded text-blue-500",title:t?"Pause":"Play",children:t?e.jsx(et,{size:14,fill:"currentColor"}):e.jsx(st,{size:14,fill:"currentColor"})})]})]})]}),e.jsxs("div",{className:"flex-1 flex overflow-hidden border-b border-blue-500/20 z-10 relative",children:[e.jsx("div",{className:"flex-1 flex flex-col",children:e.jsx(At,{recentLogs:y,selectedRowId:m,onSelect:x})}),e.jsxs("div",{className:"w-[320px] bg-black/40 p-6 overflow-y-auto no-scrollbar border-l border-blue-500/10",children:[e.jsx(Mt,{user:g,selectedRow:w,stats:v,insights:l}),e.jsx(Lt,{logs:o})]})]}),e.jsx("div",{className:"h-[40vh] bg-black relative",children:e.jsx(d.Suspense,{fallback:e.jsx(Ee,{}),children:e.jsx(Nt,{activeCluster:E,clusterMetrics:c,graphStats:u})})}),e.jsxs("div",{className:"h-[28px] flex items-center justify-between px-6 bg-black/60 text-[8px] font-bold text-white/40 uppercase tracking-widest z-20",children:[e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx("span",{children:"СИСТЕМА: АКТИВНА"}),e.jsxs("span",{children:["ЛОКАЦИЯ: ",E||"STANDBY"]})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{children:"ПОТОК:"}),e.jsx(bt,{value:o.length,className:"text-blue-500"})]})]})]})};export{Lt as ClusterStatsModule,Et as CornerBrackets,Ot as NeuralLinkTelemetry,At as TelemetryTableModule,Mt as UserProfileModule};
