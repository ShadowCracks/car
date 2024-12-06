import React, { useEffect, useMemo } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Mesh } from "three";

export function Car() {
  const gltf = useLoader(GLTFLoader, process.env.PUBLIC_URL + "models/car/scene.gltf");
  
  // Cache scene setup
  const scene = useMemo(() => {
    const scene = gltf.scene.clone();
    scene.scale.set(0.005, 0.005, 0.005);
    scene.position.set(0, -0.035, 0);
    scene.traverse((object) => {
      if (object instanceof Mesh) {
        object.castShadow = true;
        object.receiveShadow = true;
        object.material.envMapIntensity = 20;
      }
    });
    return scene;
  }, [gltf]);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const group = scene.children[0]?.children[0]?.children[0];
    if (!group) return;

    [0, 2, 4, 6].forEach(index => {
      const wheel = group.children[index];
      if (wheel) wheel.rotation.x = t * 2;
    });
  });

  return <primitive object={scene} />;
}