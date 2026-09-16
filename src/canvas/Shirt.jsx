import React, { useMemo } from 'react'
import * as THREE from 'three';
import { easing } from 'maath';
import { useSnapshot } from 'valtio';
import { useFrame } from '@react-three/fiber';
import { Decal, useGLTF, useTexture, OrbitControls } from '@react-three/drei';

import state from '../store';

const createTextTexture = (text, font, size, color) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.font = `${size}px ${font}`;
  const textWidth = ctx.measureText(text).width;
  canvas.width = textWidth;
  canvas.height = size;
  ctx.fillStyle = color;
  ctx.font = `${size}px ${font}`;
  ctx.fillText(text, 0, size);
  return new THREE.CanvasTexture(canvas);
}

const Shirt = () => {
  const snap = useSnapshot(state);
  const { nodes, materials } = useGLTF('/shirt.glb');

  const logoTexture = useTexture(snap.frontLogoDecal);
  const fullTexture = useTexture(snap.fullDecal);
  const backLogoTexture = useTexture(snap.backLogoDecal);

  useFrame((_, delta) => easing.dampC(materials.lambert1.color, snap.color, 0.25, delta));

  const frontTextTexture = useMemo(
    () => snap.isFrontText ? createTextTexture(snap.frontText, snap.frontTextFont, snap.frontTextSize, snap.frontTextColor) : null,
    [snap.isFrontText, snap.frontText, snap.frontTextFont, snap.frontTextSize, snap.frontTextColor]
  );

  const backTextTexture = useMemo(
    () => snap.isBackText ? createTextTexture(snap.backText, snap.backTextFont, snap.backTextSize, snap.backTextColor) : null,
    [snap.isBackText, snap.backText, snap.backTextFont, snap.backTextSize, snap.backTextColor]
  );

  return (
    <>
      <OrbitControls />
      <group>
        <mesh
          geometry={nodes.T_Shirt_male.geometry}
          material={materials.lambert1}
          material-metalness={0.1}
          dispose={null}
        >
          {snap.isFullTexture && (
            <Decal
              position={[0, 0, 0]}
              rotation={[0, 0, 0]}
              scale={1}
              map={fullTexture}
              depthTest={false}
              depthWrite={true}
            />
          )}

          {snap.isFrontLogoTexture && (
              <Decal
                position={snap.frontLogoPosition}
                rotation={[0, 0, 0]}
                scale={snap.frontLogoScale}
                map={logoTexture}
                map-anisotropy={16}
                depthTest={false}
                depthWrite={true}
              />
          )}
          {frontTextTexture && (
          <Decal
            position={snap.frontTextPosition}
            rotation={snap.frontTextRotation}
            scale={snap.frontTextScale}
            map={frontTextTexture}
          />
          )}

          {snap.isBackLogoTexture && (
            <Decal
              position={snap.backLogoPosition}
              rotation={snap.backLogoRotation}
              scale={snap.backLogoScale}
              map={backLogoTexture}
              map-anisotropy={16}
              depthTest={false}
              depthWrite={true}
            />
          )}
          {backTextTexture && (
            <Decal
              position={snap.backTextPosition}
              rotation={snap.backTextRotation}
              scale={snap.backTextScale}
              map={backTextTexture}
            />
          )}
        </mesh>
      </group>
    </>
  );
}

export default Shirt
