import { Canvas } from '@react-three/fiber';
import { Environment, Float, MeshDistortMaterial } from '@react-three/drei';

const FloatingShapes = () => {
  return (
    <>
      <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
        <mesh position={[-2, 1, -2]}>
          <octahedronGeometry args={[1]} />
          <MeshDistortMaterial color="var(--color-brand-primary)" distort={0.4} speed={2} roughness={0.2} metalness={0.8} />
        </mesh>
      </Float>

      <Float speed={1.5} rotationIntensity={2} floatIntensity={1.5}>
        <mesh position={[2, -1, 1]}>
          <torusKnotGeometry args={[0.8, 0.2, 100, 16]} />
          <MeshDistortMaterial color="var(--color-brand-pink)" distort={0.2} speed={1} roughness={0.1} metalness={0.9} />
        </mesh>
      </Float>

      <Float speed={2.5} rotationIntensity={1} floatIntensity={2.5}>
        <mesh position={[0, -2, -4]}>
          <sphereGeometry args={[1.5, 32, 32]} />
          <MeshDistortMaterial color="var(--color-brand-green)" distort={0.5} speed={3} roughness={0.4} metalness={0.6} />
        </mesh>
      </Float>
    </>
  );
};

export const Hero3D = () => {
  return (
    <div className="absolute inset-0 z-0 bg-brand-background pointer-events-auto">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="var(--color-brand-primary)" />
        <Environment preset="city" />
        <FloatingShapes />
      </Canvas>
      <div className="absolute inset-0 bg-brand-background/20 backdrop-blur-3xl" style={{ maskImage: 'radial-gradient(circle at center, transparent 30%, black 100%)', WebkitMaskImage: 'radial-gradient(circle at center, transparent 30%, black 100%)' }} />
    </div>
  );
};
