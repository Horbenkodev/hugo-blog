---
title: How to Pre-populate Android Room Database on First App Launch
breadcrumbs: Android Room Database Pre-Population
draft: false
publishDate: 2018-12-12T00:00:00.000Z
image: coding.jpg
og_image: coding.jpg
description: Learn how to prepopulate a Room database with a small data set on
  the first launch of a standalone app. This article provides a guide for
  achieving this without a backend.
promote:
  promote: false
top: false
authors:
  - mobile-development-team
categories:
  - development
industries: []
---
Sometimes we need an application to be prefilled with some data on its first launch. Usually, we would make a REST query and receive the data from backend, but our application is standalone so that the only data source we have is our apk file.

In this article, I will describe a recipe how to prepopulate Room database with a small data set and how to do it in a few simple steps. Another profit from the approach below is that you can populate data from system resources and you can benefit from localization of the resources.

![Megapolis](Megapolis.jpg)

Let's suppose that we need to develop an application with a set of the **largest cities** available after first application start. It would be nice for a user to see a list of cities related to user's location.

Let's put the largest cities in a simple Room Entity like this:

<script src="https://gist.github.com/sanya5791/6e2a543f362b89732990fb6d8fc94a08.js"></script>

Here is the list of three simple steps we need to implement:

* Create a Singleton for RoomDatabase instance
* Add a callback on creating data base
* Populate database

As you know, we should have only one instance of RoomDatabase within application to have it working correctly. So that we create a Singletone for RoomDatabase instance.

<script src="https://gist.github.com/sanya5791/8c6737d9161e2a8f82e1ec41196a7d42.js"></script>

This is a regular thread safe, lazy Singletone. The idea is pretty straightforward – instantiate RoomDb in case it is NOT instantiated yet. Also we synchronize the method so that calls from different threads wait until the RoomDb instantiation is finished.

Next, we add a callback while creating our database. Here is the code:

<script src="https://gist.github.com/sanya5791/b57666af829e67816f8494ce967d53aa.js"></script>

In the above code, we implement Callback and override its onCreate method with parameter ```SupportSQLiteDatabase```. However, we want to use the power of Room ORM rather than inflating database with SQL queries. Therefore, we need to obtain an instance of RoomDb within the onCreate callback as soon as instantiation of RoomDb is finished. To achieve this, we call getInstance() in a dedicated Thread and this is the place where we get use of Singleton thread safety feature.

Now, with RoomDb instance and Android Context we call method prepopulateDb:

<script src="https://gist.github.com/sanya5791/2501399e15546ee7a98b818c7ea839c6.js"></script>

So the method involves creating an instance of CityDao and inserting a set of the largest cities from string resources. By assigning a dedicated set of cities for each user location, pre-populated data can be easily edited by simply changing the string resources.

This approach is simple to implement, but if you need to prefill a database with a large amount of data, it may be more efficient to copy the database file from the asset to the database application folder.

Of course, you might want to use Dagger for Singleton, in this case you need to adopt the Singleton for using in a Dagger module.

You can find a simple related project [here](https://github.com/sanya5791/RoomPrepopulation).

Feel free to contact us to comment on this article or get a [custom software development](https://anadea.info/services/custom-software-development) quote.
