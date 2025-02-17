---
ceoTitle: Kotlin for Java Developers – Simplify Your Coding
title: "Kotlin: How to Make a Java Developer's Life Easier?"
breadcrumbs: Kotlin Overview
draft: false
publishDate: 2016-12-07T00:00:00.000Z
image: Kotlin-for-java-developers.jpg
og_image: Kotlin-for-java-developers.jpg
description: On February 15, 2016 JetBrains company released v1.0 of Kotlin.
  Let's discuss why Kotlin is good and if there are any drawbacks of using this
  language, both for developers and for entrepreneurs.
promote:
  promote: false
top: false
authors:
  - marketing-team
categories:
  - development
industries: []
---
On February 15, 2016 JetBrains company released version 1.0 of <a href="https://kotlinlang.org/" target="_blank">Kotlin</a>, a programming language that has been in development for about 5 years. This language works on JVM. We've already talked about what <a href="https://anadea.info/services/web-development/java">Java development</a> is with our developer Alexander Mihalchenko. Today, we met again with Alexander, this time to discuss Kotlin - why Kotlin is good and if there are any drawbacks of using this language, both for developers and for entrepreneurs.

## Interview with Alex

**Hello, Alex.**<br>
Hi to you too.

**So, what is Kotlin?**<br>
Kotlin is a programming language, developed by JetBrains company, running on the Java platform. It uses JDK, like Java itself but has a different syntax. The idea isn't new, there are already existing languages that do the same - Scala and Closure, for example. They appeared mainly because of issues with Java in terms of syntax. In other words, Java is a good, reliable and powerful language, you can use it to build server-side applications. However, its syntax, let's say, is unnecessarily wordy. The fact is that Java's developers upgrade it in a rather inertly manner. They are keeping maximal backward compatibility and consider that, when uses move to a new version of Java, a code written back in '95 should work for them anyway. They even have a slogan: "write once, run anywhere". Of course, this is more about cross-platform benefits of Java...

**... but they decided to dig deeper?**<br>
Yes, the code written on one version of Java will work on all following versions.

**A bold aspiration!**<br>
In fact, this is where the problem lies - they do not throw old things from the language. This slows down the development of Java. Over time, various trash comes up. There's even a label for outdated classes, which marks them inside the JDK. According to documentation, when such label appears it means that the old functionality may be ceased in the next versions, but I'm not aware of any occasions when it actually happened.

**Do developers recognize that these outdated methods aren't used anymore?**<br>
They understand and even insist that these methods should not be used. But as far as there is a software apps written on old versions, it's not possible to simply remove the old code. All those applications will get broken.

**So, what did Kotlin get rid of?**<br>
Kotlin and other JVM-languages help developers to write programs with less code. In addition to everything that exists in Java, they provide things from the world of functional programming. This greatly facilitates code writing, makes it more concise and expressive. The less code we write, the less of it needs to be maintained and the fewer tests we have to write. Actually, the majority of programming languages emerged because of this particular reason - to change Java syntax, make it more convenient and more pragmatic.

**Is the Kotlin language in a high demand now?**<br>
Currently, it is not very popular - the language is young, its community hasn't come together yet. Due to immaturity of Kotlin vs Scala they can't compete so far. Scala is a more powerful programming language with a long history. Scala has already passed the stage of fixing major errors and it has been updated to include a bunch of interesting stuff, while this have yet to be done for Kotlin. More mature languages have the upper hand in that for now. Nevertheless, Kotlin has a lot of ambitions. The language has been in development for five years. Developers tried to make it pragmatic and avoid mistakes that have been made in Java. So, that "write once" won’t be the major rule and the language will be easier to develop. In the future, they promise a lot of interesting features that will cover functionality currently available in Scala.

**Is it true that, like Java, Kotlin will suit better to large-scale projects?**<br>
Yes. By the syntax, it can be used just as an addition to Java. We can take the Java stack for server applications and simply replace Java with Kotlin. Everything will work and it'll be easier to write code. The question is what to choose instead of Java. Today, I think, the majority of developers will pick Scala.

**What's your personal opinion? Do you prefer Kotlin or Scala?**<br>
I like both languages. I think Kotlin will go further in respect of Android. Surely it's possible to write Android apps on Scala but there is a problem - a large runtime. It pulls behind a heap of libraries and because of that the size of apk-files increases. Kotlin already has the smallest runtime among the other languages (except Java). Typically, it's Java plus "something" and that "something" is an overhead that is trailed behind the language. Kotlin has smallest one - about 700 KB, while in Scala it is a few megabytes.

**What are the disadvantages of Kotlin?**<br>
I haven't yet come across any bugs myself and I had no problems with compiler or anything else as well. As for the syntax, it coped with all challenges I have encountered. The thing it yields to Scala is dealing with multithreading. Java, by the way, also loses in this. There is Future API in Scala. It allows you to perform asynchronous tasks in several streams. As a result, you get a normal code instead of hash of various sections operating in different streams without any visible relation between them. Scala structures all of it through the means of syntax. In Kotlin, something similar is promised to be implemented in version 1.1. But generally, I like to use Kotlin due to its solid syntax.

**What can you say about safety of Kotlin?**<br>
Here's the thing: all the code written in Kotlin is then converted into a Java code. It adds nothing from itself. Accordingly, Kotlin is safe to the same extent as Java. If we are speaking about safety of writing code, I really like Null safety in Kotlin programming. The compiler can warn coder that the reference may be empty. If we try to do anything with it, an error occurs at the compiling stage. In Java, application simply crushes at the implementation stage.

**What can Kotlin offer to business? What benefits does it provide to entrepreneurs?**<br>
For business, the key benefit of Kotlin vs Java is the fact that the development on Kotlin is cheaper. Why? It requires to write less code and as a result you get fewer code to maintain. This means that it is easier to write code and consequently the application can be developed faster. Time is money, after all.

**Small projects and Kotlin.**<br>
If we are speaking about small desktop apps, for commercial use it is better to choose C++. Yet again, Kotlin code is subsequently compiled to Java bytecode, therefore, as far as Java is good in some area, so good Kotlin as well. Kotlin is more helpful for writing programs, so it brings direct benefits primarily to coders.

**Thank you very much for the interview, Alex. It was interesting!**<br>
My pleasure.

## Summary

Kotlin is a programming language designed to make the life of coders easier by allowing them to accomplish in one line what Java takes five lines to do. It's been compared to the feeling of trading in an old Ford Focus for a brand new BMW M3 - once you experience it, you won't want to go back.

One of Kotlin's major advantages is its full compatibility with Java, both forwards and backwards. This means that all Java libraries will work with Kotlin and vice versa. Additionally, Kotlin allows Android developers to experience the benefits of Closure and Scala. Entrepreneurs will also be pleased with the increased efficiency and cost-effectiveness of software projects using Kotlin.

The only downside of Kotlin is its relative youth as a language. However, considering that it took JetBrains five years to develop the language, it's unlikely that they will abandon it anytime soon. Therefore, it's a wise decision to start implementing Kotlin now, especially for those developing apps for Android. By embracing this emerging language, developers can enhance their coding efficiency and stay ahead of the curve.
