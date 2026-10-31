import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

interface Hero3DStageProps {
  imageSrc?: string;
  accentColor?: string;
  isDark?: boolean;
  name?: string;
  className?: string;
}

export const Hero3DStage: React.FC<Hero3DStageProps> = ({
  imageSrc = '/IMG_6368.PNG',
  accentColor = '#38BDF8',
  isDark = true,
  name = 'NEERAJ MAYEKAR',
  className = '',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const isSpinningRef = useRef(false);
  const spinTriggerRef = useRef<() => void>(() => {});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Dimensions matching madhav.pro hero canvas
    const width = 500;
    const height = 550;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.8);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    // Lighting (exact setup matching madhav.pro)
    const ambientLight = new THREE.AmbientLight(0xffffff, isDark ? 2.2 : 2.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, isDark ? 3.2 : 3.6);
    dirLight1.position.set(5, 5, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, isDark ? 1.8 : 2.2);
    dirLight2.position.set(-5, -5, -5);
    scene.add(dirLight2);

    const accentPointLight = new THREE.PointLight(new THREE.Color(accentColor), 3.5, 15);
    accentPointLight.position.set(0, 5, 3);
    scene.add(accentPointLight);

    // Root Group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Load texture
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      imageSrc,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;

        // Create 3D Rounded Card / Model Group
        const cardGroup = new THREE.Group();

        // 1. Backing Frame
        const frameGeo = new THREE.BoxGeometry(3.6, 4.6, 0.16);
        const frameMat = new THREE.MeshStandardMaterial({
          color: isDark ? 0x111116 : 0xf4f4f5,
          metalness: 0.85,
          roughness: 0.25,
        });
        const frameMesh = new THREE.Mesh(frameGeo, frameMat);
        cardGroup.add(frameMesh);

        // 2. Front Photo Layer with bevel
        const photoGeo = new THREE.PlaneGeometry(3.38, 4.38);
        const photoMat = new THREE.MeshStandardMaterial({
          map: texture,
          transparent: true,
          roughness: 0.4,
          metalness: 0.1,
        });
        const photoMesh = new THREE.Mesh(photoGeo, photoMat);
        photoMesh.position.z = 0.09;
        cardGroup.add(photoMesh);

        // 3. Ambient Metallic Bezel Rim
        const rimGeo = new THREE.BoxGeometry(3.64, 4.64, 0.08);
        const rimMat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(accentColor),
          metalness: 0.9,
          roughness: 0.15,
          emissive: new THREE.Color(accentColor),
          emissiveIntensity: 0.25,
        });
        const rimMesh = new THREE.Mesh(rimGeo, rimMat);
        rimMesh.position.z = -0.05;
        cardGroup.add(rimMesh);

        rootGroup.add(cardGroup);
        setIsLoaded(true);

        // Click spin animation (matching madhav.pro timeline)
        spinTriggerRef.current = () => {
          if (isSpinningRef.current) return;
          isSpinningRef.current = true;

          const tl = gsap.timeline({
            defaults: { ease: 'power2.out' },
            onComplete: () => {
              cardGroup.rotation.y = 0;
              isSpinningRef.current = false;
            },
          });

          tl.to(cardGroup.position, {
            y: 0.85,
            duration: 0.35,
            ease: 'power2.out',
          })
            .to(
              cardGroup.rotation,
              {
                y: '+=6.28318', // 360 deg
                duration: 0.75,
                ease: 'power2.inOut',
              },
              0
            )
            .to(cardGroup.rotation, {
              x: 0.25,
              duration: 0.2,
              ease: 'power1.out',
            }, '-=0.35')
            .to(cardGroup.position, {
              y: 0,
              duration: 0.55,
              ease: 'bounce.out',
            }, '-=0.25')
            .to(cardGroup.rotation, {
              x: 0,
              duration: 0.35,
              ease: 'power2.inOut',
            });
        };
      },
      undefined,
      (err) => {
        console.error('Error loading portrait texture', err);
      }
    );

    // Mouse Tracking Parallax
    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      const x = (e.clientX - (rect.left + rect.width / 2)) / (window.innerWidth / 2);
      const y = (e.clientY - (rect.top + rect.height / 2)) / (window.innerHeight / 2);
      targetRotY = x * 0.45;
      targetRotX = -y * 0.35;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation Render Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Smooth lerp mouse parallax if not spinning
      if (!isSpinningRef.current) {
        currentRotX += (targetRotX - currentRotX) * 0.08;
        currentRotY += (targetRotY - currentRotY) * 0.08;

        rootGroup.rotation.x = currentRotX;
        rootGroup.rotation.y = currentRotY;

        // Subtle idle vertical float
        rootGroup.position.y = Math.sin(time * 2.2) * 0.09;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [imageSrc, accentColor, isDark]);

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* 3D Canvas Viewport */}
      <div
        className="relative select-none"
        style={{
          width: 'min(90vw, 500px)',
          height: 'min(95vw, 550px)',
          overflow: 'hidden',
          pointerEvents: 'auto',
        }}
      >
        <div ref={mountRef} className="h-full w-full flex items-center justify-center" />
      </div>
    </div>
  );
};

export default Hero3DStage;
