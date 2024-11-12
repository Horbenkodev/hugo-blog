---
ceoTitle: How Do Implicits Work in Scala?
title: How Do Implicits Work in Scala?
breadcrumbs: How Do Implicits Work in Scala?
slug: scala-implicits
draft: false
publishDate: 2018-02-02T00:00:00.000Z
image: programming.jpg
og_image: programming.jpg
description: Programmers strive to write simple and understandable code. The
  less code is written, the less likely it is that there is an error in it.
  Scala offers the ability to write even more concise code and rely on the help
  of the compiler.
promote:
  promote: false
top: false
authors:
  - web-development-team
categories:
  - development
industries: []
---
Programmers strive to write simple and understandable code. The less code is written, the less likely it is that there is an error in it. <a href="https://anadea.info/services/web-development/java-and-scala-development">Scala development</a> offers the ability to write even more concise code and rely on the help of the compiler. This is achieved through implicit conversions and implicit parameters. However, everything that is implicit, usually brings only misunderstanding. Let's see what lies behind the magic of implicits in Scala.

## Implicit conversions

Let's start from `implicit conversions`. The purpose of their usage can be understood from the name - the transformation of data of one type into another (string into date, array into Option, soft into warm). If there is an implicit function `A => B` in the scope, the compiler can perform such a conversion:

```scala
def call(str: String): Unit = println(str)

implicit def intToString(i: Int): String = i.toString

call(1)
```

Let's see how scalac understands this code (here and throughout `-Xprint:typer` key is used for the compiler):

```scala
object ImplicitApp extends Object with App {
  def call(str: String): Unit = scala.Predef.println(str);
  implicit def intToString(i: Int): String = i.toString();
  ImplicitApp.this.call(ImplicitApp.this.intToString(1))
}
```

Indeed, the compiler adds another method to the chain of calls, so that the type of the passed parameter in the `call` method matches the required one.

Such way of using Scala's implicit conversion is the most non-obvious. Only IDE and hours spent on debugging will let you find out why the call method works with the parameter of the wrong type. Do not abuse this kind of implicit conversions.

## Extension methods

More predictable conversions are `extension methods`. They come to the rescue if we want to add a new method to the class, when we don't have access to its source code. The required functionality is added via a new implicit class:

```scala
implicit class RichString(str: String) {
  def awesomeMethod(): Unit =
    println(s"awesomeMethod for $str")
}

"string".awesomeMethod()
```

Or, by using an implicit function that creates an anonymous class with the necessary methods:

```scala
implicit def richString(str: String) = new {
  def awesomeMethod(): Unit =
    println("awesomeMethod")
}

"string".awesomeMethod()
```

Under the hood, the following happens (with an anonymous class function as an example):

```scala
object MethodExtension extends AnyRef with App {
  implicit def richString(str: String): AnyRef{def awesomeMethod(): Unit} = {
    final class $anon extends scala.AnyRef {
      def awesomeMethod(): Unit =
        scala.Predef.println("awesomeMethod")
    };

    new $anon()
  };

  MethodExtension.this.richString("string").awesomeMethod()
}
```

As can be seen, before calling the "non-existent" method, a new object is created and this method is called on it. The presence of a specific method (albeit, at first glance, it is unclear where it came from) makes the code more readable and maintainable.

## Implicit parameters

Another way for using the implicit magic of Scala is implicit parameters. The compiler can pass parameters to the function marked with the `implicit` keyword. Parameters can be either variables or functions:

```scala
implicit val executor: Executor = (task: Task) => println(task.toString)

def run(task: Task)(implicit executor: Executor): Unit = executor.run(task)

run(new Task {})
```

The algorithm of actions is the same: the compiler finds in the scope the implicit with the needed type and passes it instead of us to the function:

```scala
object ImplicitParameter extends AnyRef with App {
  private[this] val executor: Executor =
    ((task: Task) => scala.Predef.println(task.toString()));

  implicit <stable> <accessor> def executor: Executor =
   ImplicitParameter.this.executor;

  def run(task: Task)(implicit executor: Executor): Unit = executor.run(task);

  ImplicitParameter.this.run({
    final class $anon extends AnyRef with Task {};
    new $anon()
  })(ImplicitParameter.this.executor)
};
```

Thus, we simplify the mandatory part of the signature function, and the ability to deal with the implicit is handed over to the compiler.

## Type classes

By connecting the extension methods and implicit parameters together, you get a suitable tool for working with type classes. The `typeclass` is a characteristic that defines what the class can do, what operations can be performed with this class. The most obvious example from the standard library is the `Ordering` trait. It tells that objects of this type can be ordered. Let's create our own typeclass and convenient API using implicits:

```scala
trait Equal[A] {
  def equal(a1: A, a2: A): Boolean
}

object Equal {
  def apply[A](implicit instance: Equal[A]): Equal[A] = instance

  implicit class EqualSyntax[A](a: A) {
    def equal(that: A)(implicit e: Equal[A]): Boolean =
 	   e.equal(a, that)
  }
}
```

`Equal` can be used directly (apply method):

```scala
implicit val intEqual: Equal[Int] =
 (a1: Int, a2: Int) => a1 == a2

println(Equal[Int].equal(1, 2))
```

and through the extension method that adds a method for comparison to any class (if there are corresponding implicits):

```scala
import Equal.EqualSyntax

println(1 equal 2)
```

Since we have already gone over the approaches used in the last two examples, there are no surprises for us in the compiler's actions:

```scala
object TypeClass extends AnyRef with App {
  private[this] val intEqual: Equal[Int] =
    ((a1: Int, a2: Int) => a1.==(a2));
  implicit <stable> <accessor> def intEqual: Equal[Int] =
    TypeClass.this.intEqual;
  scala.Predef.println(Equal.apply[Int](TypeClass.this.intEqual).equal(1, 2)); // substitution of an implicit parameter

  import Equal.EqualSyntax;
  scala.Predef.println(Equal.EqualSyntax[Int](1).equal(2)(TypeClass.this.intEqual)) // implicit conversion to the required typeclass
}
```

Instead of conclusion, here are some truths from Captain Obvious:

* no magic of implicits in Scala exists;
* to avoid dealing with questions about where this or that implicit has come from, adhere to agreements on their placement and usage in your project.

The source code for the examples is available on [Github](https://github.com/sergey-lagutin/implicit-simplicity).

More articles about Scala and functional programming:[](https://anadea.info/blog/tail-recursion-in-scala)

* [What is JVM and Why it is Worth to Develop Apps on Java Platform](https://anadea.info/blog/what-is-jvm-and-why-develop-apps-on-java)
