import { Float, PerspectiveCamera, Sparkles } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Bloom, ChromaticAberration, EffectComposer, Noise } from '@react-three/postprocessing';
import { memo, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { scenePalette, scenePerformance } from './scene-tokens';

interface DisposableRenderable {
  readonly geometry: { dispose: () => void };
  readonly material: THREE.Material | THREE.Material[];
}

const particleVertexShader = /* glsl */ `
  uniform float uTime;
  varying float vAlpha;
  void main() {
    vec3 nextPosition = position;
    float drift = sin(uTime * 0.24 + position.y * 0.9) * 0.14;
    nextPosition.x += drift + cos(uTime * 0.17 + position.z) * 0.08;
    nextPosition.y += sin(uTime * 0.18 + position.x * 1.4) * 0.1;
    vec4 mvPosition = modelViewMatrix * vec4(nextPosition, 1.0);
    gl_PointSize = (1.8 + sin(uTime * 0.5 + position.x) * 0.45) * (9.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
    vAlpha = 0.28 + 0.32 * sin(uTime * 0.24 + position.y * 2.0);
  }
`;

const particleFragmentShader = /* glsl */ `
  uniform vec3 uPrimary;
  varying float vAlpha;
  void main() {
    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
    float softCircle = smoothstep(0.5, 0.05, distanceToCenter);
    gl_FragColor = vec4(uPrimary, softCircle * vAlpha);
  }
`;

const energyVertexShader = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 nextPosition = position;
    nextPosition.z += sin(uv.x * 10.0 + uTime * 0.7) * 0.08;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(nextPosition, 1.0);
  }
`;

const energyFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec3 uPrimary;
  uniform vec3 uAccent;
  varying vec2 vUv;
  void main() {
    float line = smoothstep(0.5, 0.0, abs(vUv.y - 0.5));
    float sweep = smoothstep(0.0, 0.22, sin(vUv.x * 7.0 - uTime * 0.85) * 0.5 + 0.5);
    float edge = smoothstep(0.0, 0.22, vUv.y) * smoothstep(1.0, 0.78, vUv.y);
    vec3 color = mix(uPrimary, uAccent, sweep);
    gl_FragColor = vec4(color, line * edge * 0.16);
  }
`;

function createParticles() {
  const positions = new Float32Array(scenePerformance.landingParticles * 3);
  for (let index = 0; index < scenePerformance.landingParticles; index += 1) {
    const offset = index * 3;
    const radius = 2.2 + Math.random() * 4.6;
    const angle = Math.random() * Math.PI * 2;
    positions[offset] = Math.cos(angle) * radius;
    positions[offset + 1] = (Math.random() - 0.5) * 5.6;
    positions[offset + 2] = Math.sin(angle) * radius - 2.4;
  }
  return positions;
}

function SceneLifecycle() {
  const { gl, scene } = useThree();

  useEffect(() => {
    return () => {
      const stack: THREE.Object3D[] = [...scene.children];
      while (stack.length > 0) {
        const object = stack.pop();
        if (!object) continue;
        stack.push(...object.children);
        if (
          !(object instanceof THREE.Mesh) &&
          !(object instanceof THREE.Points) &&
          !(object instanceof THREE.Line)
        ) {
          continue;
        }
        const renderable = object as unknown as DisposableRenderable;
        renderable.geometry.dispose();
        const material = renderable.material;
        if (Array.isArray(material)) {
          material.forEach((entry) => {
            entry.dispose();
          });
        } else {
          material.dispose();
        }
      }
      gl.renderLists.dispose();
      gl.dispose();
    };
  }, [gl, scene]);

  return null;
}

function LandingWorld() {
  const primaryColor = useMemo(() => new THREE.Color(scenePalette.primary), []);
  const accentColor = useMemo(() => new THREE.Color(scenePalette.accent), []);
  const particleMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 }, uPrimary: { value: primaryColor } },
        vertexShader: particleVertexShader,
        fragmentShader: particleFragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [primaryColor],
  );
  const energyMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uPrimary: { value: primaryColor },
          uAccent: { value: accentColor },
        },
        vertexShader: energyVertexShader,
        fragmentShader: energyFragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      }),
    [accentColor, primaryColor],
  );
  const particlePositions = useMemo(createParticles, []);
  const particleMaterialRef = useRef(particleMaterial);
  const energyMaterialRef = useRef(energyMaterial);

  useFrame(({ clock, camera }) => {
    const time = clock.getElapsedTime();
    const particleTime = particleMaterialRef.current.uniforms.uTime;
    const energyTime = energyMaterialRef.current.uniforms.uTime;
    if (particleTime) particleTime.value = time;
    if (energyTime) energyTime.value = time;
    const push = Math.min(time / 7.2, 1);
    camera.position.z = THREE.MathUtils.lerp(8.2, 6.4, push);
    camera.lookAt(0, 0, -1.8);
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 8.2]} fov={42} />
      <ambientLight intensity={0.2} />
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[particlePositions, 3]} />
        </bufferGeometry>
        <primitive object={particleMaterial} attach="material" />
      </points>
      <mesh position={[0, 0.2, -2.5]}>
        <planeGeometry args={[13, 7, 1, 1]} />
        <primitive object={energyMaterial} attach="material" />
      </mesh>
      <Float speed={0.45} rotationIntensity={0.08} floatIntensity={0.18}>
        <mesh position={[0, 0, -1.4]}>
          <icosahedronGeometry args={[1.7, 2]} />
          <meshBasicMaterial color={scenePalette.primary} transparent opacity={0.025} wireframe />
        </mesh>
      </Float>
      <Sparkles
        count={90}
        scale={[11, 6, 8]}
        size={1.6}
        speed={0.18}
        color={scenePalette.accent}
        opacity={0.28}
      />
      <EffectComposer multisampling={0}>
        <Bloom intensity={0.82} luminanceThreshold={0.55} luminanceSmoothing={0.28} mipmapBlur />
        <Noise premultiply opacity={0.08} />
        <ChromaticAberration
          offset={new THREE.Vector2(0.0007, 0.0007)}
          radialModulation={false}
          modulationOffset={0.15}
        />
      </EffectComposer>
      <SceneLifecycle />
    </>
  );
}

export const LandingScene = memo(function LandingScene() {
  return (
    <Canvas
      className="startup-scene-canvas"
      dpr={[1, scenePerformance.maxDpr]}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 8.2], fov: 42 }}
      onCreated={({ gl }) => gl.setClearColor(scenePalette.canvas, 0)}
    >
      <LandingWorld />
    </Canvas>
  );
});
