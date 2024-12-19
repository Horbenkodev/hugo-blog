---
ceoTitle: A First Look at WebAssembly - Turning Browsers Into Power Lifters
title: A First Look at WebAssembly - Gainer That Will Turn Browsers Into Power Lifters
breadcrumbs: Impressions from WebAssembly
slug: a-first-look-at-webassembly-gainer-that-will-turn-browsers-into-power-lifters
draft: false
publishDate: 2017-03-15T00:00:00.000Z
image: person-computes-views-code-laptop.jpg
og_image: person-computes-views-code-laptop.jpg
description: Evolution is constant, and web browsers are no exception. Today, we
  explore WebAssembly, a technology that could take browsers to the next level.
promote:
  promote: false
top: false
authors:
  - web-development-team
categories:
  - development
industries: []
---
Evolution never stops. All things come into the world, grow and fade away in the end, letting other things take their place - that's the circle of life. Being a part of life, web browsers can't escape the same fate. It's time for them to grow and evolve.

Today we'll look at WebAssembly. It's a pretty interesting technology that can take web browsers to a new level. All of us get used to existing browser functions: texting, sending audio and video messages, music, videos, uploading and downloading files. But hey, how long we've been able to do this? 10 years? Maybe 15 years? That's pretty long period. We're living in the world of virtual reality, artificial intelligence, robots, flying skateboards and exo-suits. Browsers should fit this high-tech world!

WebAssembly tries to do that. Here's a short list of its features:

* **JavaScript augmentation:** WebAssembly can take care of the most computationally intensive tasks and be imported as JS module;
* **Use your favourite back end language for front end:** with WASM browser support, you can compile any language into the bytecode instead of JavaScript to use it all across the web;
* **Browsers upgrade:** performance optimization and implementation of advanced technologies like 4k-graphics or desktop applications online.
Let's have a detailed conversation about it with Michael Tsypkin, [front end developer at Anadea](https://anadea.info/services/web-development/front-end).

**Hi, Michael!**

Hello.

**Could you brief me what is WebAssembly?**

Sure. It's a new way of how browser will work. JavaScript is the only thing you can run in browser for now. It means that no other language can run inside the browser. All you have to do is to convert those languages into JavaScript. For example, you can write in Scala and convert your code with ScalaJS into JavaScript afterwards.

**And does WASM fix it?**

Yes, but it takes the idea of its predecessors. Let's talk about computer science a bit.
There're two categories of computer languages: compiling and interpreting ones. There are tons of compiling languages - C++ can be transformed into the assembler and then can be executed by processor. Assembler is the lowest level of processing. That's how compiling languages work. JavaScript is a kind of assembler for browsers. The major cons of it are low speed and numerous limitations of what you can do in browser.

The first solution of this problem was asm.js. It's an assembler adopted for JavaScript. To demonstrate its abilities, developers ran Unreal Engine 4 in Firefox browser. The performance was nearly twice slower than the UE4 itself. That's a great result because JavaScript is 16 times slower.

**Wow!**

Nevertheless, asm.js was a temporary solution. It was a kind of experiment. The idea of WebAssembly is to create permanent tool and set it as a standard in this area. WebAssembly is closer to machine code than asm.js, it's a binary file with its own format, in which you can reformat any programming language and run it in browser. So it's not a replacement of JavaScript. All web is written in JavaScript. If you remove it, the whole Internet will crash. WebAssembly is more like an augmentation - it gives possibility to write code in back end languages and run them in browser, that's it.

**It seems like WebAssembly (WASM) has a promising future, doesn't it?**

Well, it's hard to predict the future of WASM because it's still a relatively new technology. It has the potential to open up new possibilities, such as creating specific languages for browsers or improving the performance of back-end languages so that they work faster than JavaScript. But ultimately, only time will tell what the future holds for WASM.

**Is WASM similar to the Java Virtual Machine (JVM)?**

Yes, in a way. The browser itself can be considered a virtual machine, just like the JVM. The JVM is capable of running multiple languages such as Java, Scala, and Kotlin, but Java code must first be compiled into bytecode before being interpreted by the JVM. Similarly, in the browser, everything is compiled into JavaScript. With WebAssembly, however, the level of those languages is scaled down to the level of bytecode. So, in that sense, there is a connection to the JVM concept.

**Do you think WASM will make it easier for front-end developers to write code?**

In the near future, it won't have much impact on the lives of front-end developers. However, in the long run, WASM could potentially start a trend of creating more complex applications in the browser, such as complex browser games or VR technology. This could make it easier to develop these applications and ultimately raise the bar for browser applications in general. But for those who write classic front-end single page interfaces in React or Angular, it won't have much of an impact.

**Have you heard any ideas about how WASM could benefit specific operating systems?**

Yes, I've heard that WASM could be the second breath for ChromeOS. By enabling more complex applications to run in the browser, there are no limitations to what can be accomplished on the OS.

**Any business potential?**

I think, there will be a trend toward adapting desktop applications in browser. Photoshop, for example. Why not? I'm talking about its basic functions, not the whole functionality. At least, that's how I see it. There's also a theory that people would be able to write back end and front end with the same language. In Java, for example. Write server part in Java and some front end scripts. I'm a bit sceptical about it, because not all languages are good for this, but theory is theory.

**Thanks for your time, Michael!**

Anytime.

As you see, WebAssembly opens many ways for upgrading browsers. Accelerating their processing and adapting popular desktop applications looks like a next-gen browsers that we deserve. It also gives developers a possibility to improve performance of their applications and allows them to develop more complex and more productive software. We'll see how things go after its release and we can't wait for it quietly, as we're too excited about it. Hope you enjoyed this first look. Keep on reading [Anadea Blog](https://anadea.info/blog) for more interestiing news and information from the world of software development.
