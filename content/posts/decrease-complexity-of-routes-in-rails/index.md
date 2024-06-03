---
ceoTitle: A Simple Way to Decrease Complexity of Routes in Rails
title: A Simple Way to Decrease Complexity of Routes in Rails
breadcrumbs: A Simple Way to Decrease Complexity of Routes in Rails
slug: decrease-complexity-of-routes-in-rails
draft: false
publishDate: 2017-10-27T00:00:00.000Z
image: complexity_of_routes.jpg
og_image: complexity_of_routes.jpg
description: Sometimes, when you are working with a large codebase, your
  `routes.rb` files grow really fast and become very dirty.There are several
  things that make your routes file bigger:* Customization of devise;* Specific
  gems that mount additional routes (Active Admin, ActionCable);* Sidekiq +
  SidekiqWeb + Basic authentication;* Namespaces with APP or API.
promote:
  promote: false
top: false
authors:
  - web-development-team
categories:
  - development
  - ruby-on-rails
industries: []
---
Sometimes, when you are working with a large codebase, your `routes.rb` files grow really fast and become very dirty.

There are several things that make your routes file bigger:

* Customization of devise;
* Specific gems that mount additional routes (Active Admin, ActionCable);
* Sidekiq + SidekiqWeb + Basic authentication;
* Namespaces with APP or API.

All these points lead to one fact  - your file grows and it is getting hard to maintain it.

<script src="https://gist.github.com/DmytroVasin/89e4ee21637d9981ee4ce2b32525b3a2.js"></script>

However, do you need all this staff in regular work, when you add some controller with another resource? My answer is No!

<script src="https://gist.github.com/DmytroVasin/517de0e119dbd938293a45d57dd0cd3b.js"></script>

With that line of code we can split our `routes.rb` file into small compact pieces and forget about huge and long file.

![After routes splitting](routes_splitting.png)

<script src="https://gist.github.com/DmytroVasin/fd1814f8cb80316332f87185f2066998.js"></script>

Solution is pretty simple and elegant. At the same time, it makes life easier, especially in [rails development](https://anadea.info/services/web-development/ruby-on-rails-development) :)
