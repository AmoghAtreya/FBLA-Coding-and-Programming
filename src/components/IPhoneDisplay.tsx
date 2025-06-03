import React, { useRef, useEffect, Suspense, useState, useCallback } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { TextureLoader, CanvasTexture } from 'three';
import { OBJLoader } from 'three-stdlib';
import * as THREE from 'three';

// Error Boundary for texture loading
class TextureErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    console.warn('Texture loading error:', error);
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.warn('Texture loading error details:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || this.props.children;
    }

    return this.props.children;
  }
}

// Custom hook to create texture from image URL
const useImageTexture = (imageUrl: string | undefined) => {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    if (!imageUrl) {
      setTexture(null);
      return;
    }

    const loader = new TextureLoader();
    
    // Create a fallback canvas texture for SVG files or when loading fails
    const createFallbackTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 1024;
      const context = canvas.getContext('2d');
      
      if (context) {
        // Create a dark gradient background
        const gradient = context.createLinearGradient(0, 0, 0, 1024);
        gradient.addColorStop(0, '#1f2937');
        gradient.addColorStop(1, '#111827');
        context.fillStyle = gradient;
        context.fillRect(0, 0, 512, 1024);
        
        // Add some UI elements
        context.fillStyle = '#ffffff';
        context.font = '24px Arial';
        context.fillText('FinFlow', 40, 80);
        
        context.fillStyle = '#9ca3af';
        context.font = '16px Arial';
        context.fillText('Portfolio Overview', 40, 110);
        
        // Balance card
        context.fillStyle = '#374151';
        context.fillRect(40, 140, 432, 120);
        
        context.fillStyle = '#9ca3af';
        context.font = '14px Arial';
        context.fillText('Total Balance', 60, 170);
        
        context.fillStyle = '#ffffff';
        context.font = 'bold 32px Arial';
        context.fillText('$3,247.80', 60, 210);
        
        // Chart area
        context.fillStyle = '#374151';
        context.fillRect(40, 280, 432, 180);
        
        context.fillStyle = '#ffffff';
        context.font = 'bold 16px Arial';
        context.fillText('Spending Analytics', 60, 310);
        
        // Simple chart line
        context.strokeStyle = '#10b981';
        context.lineWidth = 3;
        context.beginPath();
        context.moveTo(60, 420);
        context.quadraticCurveTo(150, 380, 240, 390);
        context.quadraticCurveTo(330, 370, 420, 380);
        context.stroke();
      }
      
      return new CanvasTexture(canvas);
    };

    // Try to load the image first
    loader.load(
      imageUrl,
      (loadedTexture) => {
        setTexture(loadedTexture);
      },
      undefined,
      (error) => {
        console.warn('Failed to load texture, using fallback:', imageUrl, error);
        // Use fallback texture
        setTexture(createFallbackTexture());
      }
    );

    return () => {
      if (texture) {
        texture.dispose();
      }
    };
  }, [imageUrl]);

  return texture;
};

interface IPhoneModelProps {
  screenImage?: string;
  rotation?: [number, number, number];
  position?: [number, number, number];
  scale?: number;
}

function IPhoneModel({ screenImage, rotation = [0, 0, 0], position = [0, 0, 0], scale = 1 }: IPhoneModelProps) {
  const meshRef = useRef<THREE.Group>(null);
  
  // Load the iPhone model
  const obj = useLoader(OBJLoader, '/models/Iphone seceond version finished.obj');
  
  // Load screen texture using custom hook
  const screenTexture = useImageTexture(screenImage);

  // Gentle floating animation
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime;
      meshRef.current.rotation.y = rotation[1] + Math.sin(time * 0.3) * 0.01;
      meshRef.current.position.y = position[1] + Math.sin(time * 0.5) * 0.02;
    }
  });

  useEffect(() => {
    if (obj) {
      obj.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          // Check if this is the screen part of the phone
          if (child.name?.toLowerCase().includes('screen') && screenTexture) {
            // Apply screen texture
            child.material = new THREE.MeshBasicMaterial({ 
              map: screenTexture,
              transparent: true,
            });
          } else {
            // Apply iPhone material (sleek metallic finish)
            child.material = new THREE.MeshStandardMaterial({
              color: 0x1a1a1a,
              metalness: 0.9,
              roughness: 0.1,
              envMapIntensity: 1,
            });
          }
          
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    }
  }, [obj, screenTexture]);

  if (!obj) {
    // Fallback to simple geometry if model fails to load
    return (
      <group ref={meshRef} position={position} rotation={rotation} scale={scale}>
        {/* Simple iPhone-like shape as fallback */}
        <mesh>
          <boxGeometry args={[0.5, 1, 0.05]} />
          <meshStandardMaterial 
            color="#1a1a1a" 
            metalness={0.9} 
            roughness={0.1} 
          />
        </mesh>
        {/* Screen area */}
        <mesh position={[0, 0, 0.026]}>
          <boxGeometry args={[0.4, 0.8, 0.001]} />
          <meshBasicMaterial 
            map={screenTexture}
            transparent={true}
            opacity={0.9}
          />
        </mesh>
      </group>
    );
  }

  return (
    <group ref={meshRef} position={position} rotation={rotation} scale={scale}>
      <primitive object={obj.clone()} />
    </group>
  );
}

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[0.5, 1, 0.05]} />
      <meshStandardMaterial color="#333333" />
    </mesh>
  );
}

interface IPhoneDisplayProps {
  screenImage?: string;
  rotation?: [number, number, number];
  position?: [number, number, number];
  scale?: number;
  className?: string;
  enableControls?: boolean;
}

const IPhoneDisplay: React.FC<IPhoneDisplayProps> = ({
  screenImage,
  rotation = [0.1, 0.2, 0],
  position = [0, 0, 0],
  scale = 1,
  className = "",
  enableControls = false,
}) => {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 3], fov: 45 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
        shadows
        onCreated={({ gl }) => {
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
        }}
      >
        {/* Lighting setup for realistic iPhone appearance */}
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={0.8}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        <pointLight position={[-5, 0, 5]} intensity={0.3} />
        <pointLight position={[5, 0, -5]} intensity={0.2} />
        
        {/* Optional controls for debugging */}
        {enableControls && <OrbitControls enableZoom={false} />}
        
        <TextureErrorBoundary fallback={<LoadingFallback />}>
          <Suspense fallback={<LoadingFallback />}>
            <IPhoneModel
              screenImage={screenImage}
              rotation={rotation}
              position={position}
              scale={scale}
            />
          </Suspense>
        </TextureErrorBoundary>
      </Canvas>
    </div>
  );
};

export default IPhoneDisplay; 