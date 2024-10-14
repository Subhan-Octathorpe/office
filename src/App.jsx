import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, useTexture } from "@react-three/drei";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

// Model component that loads the GLTF model and optionally applies a baked texture
function Model({ modelPath, texturePath }) {
  const gltf = useGLTF(modelPath); // Load the model (either "untitled.glb" or "office1.glb")
  const bakedTexture = texturePath ? useTexture(texturePath) : null; // Load the baked texture if provided

  if (bakedTexture) {
    bakedTexture.encoding = THREE.sRGBEncoding; // Ensure the texture is in the correct encoding
  }

  gltf.scene.traverse((child) => {
    if (child.isMesh) {
      if (bakedTexture) {
        // Apply the baked texture if it's provided
        child.material.map = bakedTexture;
      } else {
        // Remove the texture when switching to the model without baked shadows
        child.material.map = null;
      }
      child.material.needsUpdate = true; // Force update
    }
  });

  return <primitive object={gltf.scene} />;
}

function App() {
  const [useBakedModel, setUseBakedModel] = useState(false); // State to toggle between models

  // Paths for models and textures
  const modelPath = useBakedModel ? "office1.glb" : "untitled.glb";
  const texturePath = useBakedModel ? "bake.jpg" : null;

  // Toggle function to switch between models
  const toggleModel = () => {
    setUseBakedModel((prev) => !prev); // Toggle between the two models
  };

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      <Canvas>
        <Stage>
          <Model modelPath={modelPath} texturePath={texturePath} scale={[0.5, 0.5, 0.5]} />
        </Stage>
        <OrbitControls />
      </Canvas>

      {/* Button to toggle between models */}
      <button
        onClick={toggleModel}
        style={{
          position: "fixed",  // Make sure the button stays in the viewport
          top: "40px",        // 20px from the top of the screen
          right: "130px",      // 20px from the right of the screen
          padding: "10px 20px",
          backgroundColor: "black",
          color: "white",
          border: "none",
          cursor: "pointer",
          zIndex: 1000,       // Ensure the button is on top of the canvas
        }}
      >
        {useBakedModel ? "Without Baked Shadows" : "With Baked Shadows"}
      </button>
    </div>
  );
}

export default App;
