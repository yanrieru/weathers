// import { Canvas } from "@react-three/fiber";
// import { OrbitControls } from "@react-three/drei";

// export default function Background3D() {
//   return (
//     <div className="absolute inset-0 -z-10">
//       <Canvas camera={{ position: [0, 0, 5] }}>
//         {/* Cahaya */}
//         <ambientLight intensity={0.5} />
//         <directionalLight position={[5, 5, 5]} intensity={1} />

//         {/* Objek 3D sederhana */}
//         <mesh>
//           <sphereGeometry args={[1.5, 32, 32]} />
//           <meshStandardMaterial color="lightblue" />
//         </mesh>

//         {/* Biar bisa diputer pakai mouse (sementara) */}
//         <OrbitControls enableZoom={false} />
//       </Canvas>
//     </div>
//   );
// }
