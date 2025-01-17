---
ceoTitle: "Three.js Library: A Guide to 3D Web Development"
title: Our experience with Three.js library
breadcrumbs: Three.js library
slug: three-js-library
draft: false
publishDate: 2022-08-24T00:00:00.000Z
image: sharks.jpg
og_image: sharks.jpg
description: "Some exciting experiments with the Three.js library, including 3D
  loading, creating complex animations, and exploring possibilities of
  interactive 3D graphics. "
promote:
  promote: false
top: false
authors:
  - polina-borysova
categories:
  - development
industries: []
---
In the flow of everyday tasks from customers, we constantly had to face mechanisms for working with complex animations or with complex graphic designs. As one of the possible ways to solve such problems, we chose to use the <a href="https://threejs.org/docs/index.html#manual/en/introduction/Creating-a-scene" target="_blank" rel="nofollow">Three.js library</a>, which has quite a wide range of configurational and practical usage.

Below, you will find the description of our experience and some experiments in using this library, along with the main features and the paths to reach the goals set with code examples.

## Part I—Introduction

Since most of our <a href="https://anadea.info/services/web-development/front-end" target="_blank">Front-End development</a> projects are written in React, it was appropriate to experiment in the React space. But when we tried to integrate the code into the React component, we encountered many inconveniences caused by the specifics of Three.js and React working in tandem.

Yes, all of these incompatibilities could be bypassed if the code was played around with well, given the specifics of React. But why should we waste time on something that has been investigated before? So instead of the native Three.js, we advise to use a library which was developed specifically for React applications, **<a href="https://docs.pmnd.rs/react-three-fiber/getting-started/introduction" target="_blank" rel="nofollow">React-three-fiber</a>**. It is installed via npm and has a clear documentation.

```shell
$ npm install three @react-three/fiber
```

There is only one drawback, or rather a nuance in it: the library works only with React version 18 or higher.

Despite the convenience of React-three-fiber, we still recommend you start exploring the 3D world with native Three.js. That’s because to navigate well in 3D and the possibilities of the library, first, you must learn the main concepts of the library: scene, camera, mesh, which consists of its geometry and material and lighting (ambient or point lights). You should understand how the XYZ axes are located and how to navigate the Three.js.

## Part II—Loading 3D models

The library is most frequently used for uploading 3D models from designers of the page. Just uploading, showing and lighting isn’t so complicated and doesn’t require a lot of effort from the developer. You are able to add animation for the model, such as rotation on its axis. Or you can add a possibility to interact with the model via OrbitControls.

Our designer has drawn the company logo in Blender and had it in 3 formats: glb, fbx, obj. All of these formats are supported by **Three.js** and **React-three-fiber**.

<div style="position: relative; padding-bottom: 56.25%; height: 0;">
<iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" width="560" height="315" src="https://www.youtube.com/embed/q1xsB3w1EZI?showinfo=0&loop=1&playlist=q1xsB3w1EZI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

The latter format gives us the possibility to upload the model without material (just a white) and color it using JavaScript. This way, you can make your model more interactive. It is possible to change the texture, make it more rough or metallic.

<div style="position: relative; padding-bottom: 56.25%; height: 0;">
<iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" width="560" height="315" src="https://www.youtube.com/embed/Pr5iNqQwHns?showinfo=0&loop=1&playlist=Pr5iNqQwHns" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

## Part III—3D models in JavaScript

**This part is about creating a 3D model on the example of animated Earth.**

Creating a 3D model using only code will require more effort and time than just uploading one. You need to have a basic knowledge of the library’s opportunities, geometry and material species, and a good 3D orientation. Certainly, you can find a lot of videos or articles about how it’s best to create one or another training model and how to interact with textures and animation. Having brought all parts together (knowledge, ideas and comments from the project team), we’ve created something interesting:

<div style="position: relative; padding-bottom: 56.25%; height: 0;">
<iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" width="560" height="315" src="https://www.youtube.com/embed/5h_iS4cSwow?showinfo=0&loop=1&playlist=5h_iS4cSwow" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

You can end up in outer space if you add <code><OrbitControls /></code> to the code.

<div style="position: relative; padding-bottom: 56.25%; height: 0;">
<iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" width="560" height="315" src="https://www.youtube.com/embed/s0JYLwVNIVs?showinfo=0&loop=1&playlist=s0JYLwVNIVs" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

As we can see, the geometry is rather simple - it’s a sphere. However, the materials are more complex. Textures (special images) of Earth and Moon were used here. These are easily found on the Internet. You can use <code><meshStandardMaterial map={moonTexture}/></code> with Moon texture <code>(moonTexture)</code> or use <a href="https://threejs.org/docs/#api/en/materials/ShaderMaterial" target="_blank" rel="nofollow">Shaders</a> to get complex texture, for example, atmosphere imitation. This aspect is tricky enough and should be approached individually, but you can find a lot of examples of code that can be adapted to your needs. That’s what we did.

As for animation, the Earth’s axis-turning was the easiest part. You should only set the axis and rotation speed.

```javascript
useFrame(() => {
 ref.current.rotation.y += 0.002;
});
```

By the way, custom hooks from the React-three-fiber library like **useFrame** and **useLoader** are irreplaceable hooks for comfortable work with 3D in React apps. **useFrame** is used to work with animation; **useLoader** is used for uploading 3D models, maps, textures and vertices.

Rotating the Moon around the Earth by the circle trajectory was a more complex task. Here, you could use some math.

```javascript
useFrame(() => {
 // circle trajectory
 let date = Date.now() * 0.0005 + 1;
 ref.current.position.set(
  Math.cos(date) * 2 + 0,
  0,
  Math.sin(date) * 2 + 0);
 // rotation
 ref.current.rotation.y += 0.004;
})
```

<code>date</code> sets sequential coefficients for changing coordinate values, and adjustment of the 0.0005 number can increase or slow down the rotation speed.

I set the Moon’s position x-y-z below, where y stays equal to zero because I want the trajectory to be horizontal, in the *X* plane. However, you can set <code>y = Math.sin(date) * 2 + 0</code> and get the elliptical trajectory inclined at 45 degrees.

By the way, 0 in the end is the pivot coordinate, around which the mesh is rotating. We have a pivot at the Earth sphere (position 0-0-0). So, we can get different results by changing one or another parameter.

Stars are also moving according to the set direction. We’ll provide more details on it down the road.

The most challenging task was setting real coordinates by using latitudes and longitudes of specific places on Earth. Out of curiosity, we chose coordinates of a real flight around the world:

Kyiv-Dubai-Manila-Osaka-Honolulu-Seattle-London-Lviv

```javascript
const pinsCoordinates = [
 { lat: 50.450001, lng: 30.523333 }, //Kyiv
 { lat: 25.276987, lng: 55.296249 }, //Dubai
 { lat: 14.599512, lng: 120.984222 }, //Manila
 { lat: 34.672314, lng: 135.484802 }, //Osaka
 { lat: 21.315603, lng: -157.858093 }, //Honolulu
 { lat: 47.608013, lng: -122.335167 }, //Seattle
 { lat: 51.509865, lng: -0.118092 }, //London
 { lat: 49.842957, lng: 24.031111 }, //Lviv
]
```

Meanwhile, xyz-coordinates should alter depending on the sphere sizes.

```javascript
/* Getting coordinates x,y,z on the sphere by latitude and longitude.
  Sphere scale should be '1' */
function getCoordinates(lat, lng) {
 // convert latitude and longitude to Phi and Theta
 const Phi = (90 - lat) * (Math.PI / 180);
 const Theta = (lng + 180) * (Math.PI / 180);
 // r = radius of SphereGeometry (should be 1 to be better)
 // x = -r * (sin(Phi) * cos(Theta))
 // y = cos(Phi)
 // z = sin(Phi) * sin(Theta)
 const x = -(Math.sin(Phi) * Math.cos(Theta));
 const y = Math.cos(Phi);
 const z = Math.sin(Phi) * Math.sin(Theta);

 return { x, y, z };
}
```

As you can see, the function takes lat-lng pare and returns xyz coordinates for the subsequent pin on the sphere. By experimenting with the size and scale of the sphere, we discovered that to get the most precise coordinates, we better use radius and scale of 1 and adjust the initial sphere’s size by changing the distance from the Camera.

To get the imitation that all pins are a whole and rotate along with the Earth, you should group them using the <code><group><group/></code> tag. We can see the result once we remove the Earth. Adding the same rotation trajectory like that of the Earth complemented the imitation.

<div style="position: relative; padding-bottom: 56.25%; height: 0;">
<iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" width="560" height="315" src="https://www.youtube.com/embed/iORKqvBIhYA?showinfo=0&loop=1&playlist=iORKqvBIhYA" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

Below, see the example of the Pin’s component code:

```jsx
const pinsXYZCoordinates = [];
pinsCoordinates.forEach((pin) => {
 const pinXYZ = getCoordinates(pin.lat, pin.lng);
 pinsXYZCoordinates.push(pinXYZ);
});

function Pins() {
 const ref = useRef();

 useFrame(() => {
  ref.current.rotation.y += 0.002;
 });

 return (
  <>
   <group ref={ref}>
    {pinsXYZCoordinates.map((pin) => {
     return (
      <mesh key={pin.x} position={[pin.x, pin.y, pin.z]}>
       <sphereGeometry args={[0.02, 30, 30]}></sphereGeometry>
       <meshStandardMaterial color={0xdc296c}></meshStandardMaterial>
      </mesh>
     );
    })}
   </group>
  </>
 );
}
```

Here, pins are small spheres of standard material and color. But you are free to use more complex geometries or upload your own 3D models at all.

## Part IV—Complex animation along a given trajectory

Continuing the topic of animation, we managed to get a certain shape from random positioning points **on the example of an outline of a country**.

We haven’t found any service that draws the outlines of shapes, so we drew the shape of the country ourselves. It consists of 120 2D vectors <code>Vector2(x,y)</code> and is then divided into a given number of points. For clarity, we’ve left the static shape on the left.

<div style="position: relative; padding-bottom: 56.25%; height: 0;">
<iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" width="560" height="315" src="https://www.youtube.com/embed/l_ZK-y0JlxQ?showinfo=0&loop=1&playlist=l_ZK-y0JlxQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

To make such an animation, we need to get the initial and the final 3D coordinates of each point. As the shape consists of 2D vectors, we transformed the point’s scope to an array of positions of each point - <code>\[[1.34, 2.34, 1.5], \[1.62, 2.28, 1.5], . . . ]</code>.

The random coordinates were obtained quite easily, and the stars from Part III were distributed in the same way.

```javascript
// creates 500 random coordinates for star-points
const starVertices = [];
for (let i = 0; i < 500; i++) {
 const x = (Math.random() - 0.5) * 30;
 const y = (Math.random() - 0.5) * 20;
 const z = -Math.random() * 10;
 starVertices.push(x, y, z)
}
```

In this example, all points are separate Meshes (Components) which were added to the scene using <code>Array.map()</code>. This enables us to animate each point separately by a single line of code:

```javascript
vector = new THREE.Vector3(x, y, z) // set the direction of mesh movement

useFrame(() => {
 // 0.008 - part of vector's path wich mesh goes by one frame
 ref.current.position.lerp(vector, 0.008)
})
```

So, this method can be used to move Mesh from one point to another.

## Part V—Conclusion

The examples of using the **Three.js library** above are just a drop in the ocean of the library's capabilities. In this case, the official documentation won’t give a full understanding of 3D. We watched a lot of video tutorials, read a lot of articles on the Internet and made a lot of mistakes on the way to achieving the desired result. Another complication is that many examples are only applied to Three.js. Therefore, it was necessary to adjust the solution to React-three-fiber.

Overall, the library is very cool and 100% worth your attention.
