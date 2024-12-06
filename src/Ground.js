import React, { useEffect, useMemo } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { MeshReflectorMaterial } from "@react-three/drei";
import { LinearEncoding, RepeatWrapping, TextureLoader, Vector2 } from "three";

export function Ground() {
  const [roughness, normal] = useLoader(TextureLoader, [
    process.env.PUBLIC_URL + "textures/terrain-roughness.jpg",
    process.env.PUBLIC_URL + "textures/terrain-normal.jpg",
  ]);

  const textures = useMemo(() => {
    [normal, roughness].forEach((t) => {
      t.wrapS = RepeatWrapping;
      t.wrapT = RepeatWrapping;
      t.repeat = new Vector2(5, 5);
      t.offset.set(0, 0);
    });
    normal.encoding = LinearEncoding;
    return { normal, roughness };
  }, [normal, roughness]);

  useFrame((state) => {
    const t = -state.clock.getElapsedTime() * 0.128;
    textures.roughness.offset.set(0, t % 1);
    textures.normal.offset.set(0, t % 1);
  });

  return (
    <mesh rotation-x={-Math.PI * 0.5} castShadow receiveShadow>
      <planeGeometry args={[30, 30]} />
      <MeshReflectorMaterial
        resolution={512}
        blur={[400, 100]}
        mixBlur={1}
        mixStrength={15}
        roughness={0.7}
        depthScale={1.2}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#050505"
        metalness={0.5}
        normalMap={textures.normal}
        roughnessMap={textures.roughness}
        normalScale={[0.15, 0.15]}
      />
    </mesh>
  );
}