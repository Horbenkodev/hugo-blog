---
ceoTitle: Atomic Design 2.0 & Style Guide Driven Development
title: " Atomic Design 2.0 and Style Guide Driven Development"
breadcrumbs: " Atomic Design 2.0 and Style Guide Driven Development"
slug: atomic-design-2-0-and-style-guide-driven-development
draft: false
publishDate: 2020-06-23T00:00:00.000Z
image: atomic-design-2-0-and-style-guide-driven-development.jpg
og_image: atomic-design-2-0-and-style-guide-driven-development-1.jpg
description: Design covers the entire process of creating components, from
  design to layout. Modern JS libraries and frameworks like React, Angular, and
  Bootstrap.
promote:
  promote: false
top: false
authors: []
categories: []
industries: []
---
## What is atomic design?

In 2013, Brad Frost revolutionized the world of web application design with his article on <a href="https://bradfrost.com/blog/post/atomic-web-design/" rel="nofollow" target="_blank">atomic design</a>. The preface to his article reflects the trend of recent years in software development:

> We are not designing pages, we are designing systems of components.

— Stephen Hay

Design involves the entire process of creating components: starting from design, going through layout to complete isolation of components in the frontend. Modern JS libraries and frameworks enthusiastically accepted these ideas: react, angular, styled-components, bootstrap.

We’ve already realized that we need to break everything down into components. But still, what exactly does atomic design give us for this? As a methodology, it suggests that we use the nesting structure of these components. As a result, we have 5 levels of hierarchy:

1. Atoms
2. Molecules
3. Organisms
4. Templates
5. Pages

Let’s not dwell on every single one of them, because Brad’s article on this subject is too beautiful to take away his readers.

## What does all this mean in practice?

Have you tried this methodology in your project? If not, you just have to! If you have a React project, start with a style guide. Describe all atom components: form fields, icons, buttons, simple blocks, typography (texts, headings, links). Next, go to the component-molecules: forms, bread crumbs, small blocks of elements consisting of atoms.

Done? Move on to the next level: components-organisms. Based on the atomic design methodology, these are all other elements: large and small blocks, non-standard elements, sliders, website headers, menu, modals widgets, product blocks, and others. That’s what happens next - that other stuff, this large set of components in itself becomes kind of a monster. And the block of social buttons is on the same level of nesting with the whole block of the header containing the logo, menu, user profile, and shopping cart.

This was a hint that something was wrong with this system. It makes me want to expand it with a few more layers, sort out all this chaos somehow.

Let’s move on to components-templates. What is this in terms of atomic design: blank wireframe not filled with any data. In practice, in our style guide, we are already filling our components with various data: empty and informative, valid and invalid, exploring all boundary cases to look at the behavior of the component from all sides.

So, do we need a template? The answer is definitely No.

And the pages. They include the components described above and are ready to show them to the customer as a finished product of our work.

## From Chemistry to Biology

![Atomic design methodology](atomic-design-2-0-and-style-guide-driven-development-1.jpg)

As you can see, in practice, everything is much more complicated. What do we do? Bend to a methodology that seems to be not well thought out? Why not expand it with your own concepts, and not adapt it to your needs?

First, throw out the templates. No regrets. Nobody uses them. Swoosh. No templates.

The second is the need to split the level of Organisms into several ones. Everything described below is my experience of using atomic design in a real project. And the layers I invented reflect the need for these entities.

I needed layers that would continue the chemical sequence of atoms, molecules, organisms… Actually, organisms are already moving into the biology section, so I’ve continued with a series of levels from the biology:

* Populations
* Ecosystems
  (of course, pages of components following after them do not sound very good, but they were always out of line)

## What are the new layers fraught with?

Or how to differentiate them from organisms?

To begin with, I identified two broad categories of layers:

1. **Abstract** - a category for entities that are not tied to a specific subject area. In the framework of atomic design 2.0, this category includes the first 3 layers:

* Atoms
* Molecules
* Organisms.

They can be filled with any content. An example of an atom: button; what does it do, what is it responsible for? In the component itself, we will never know this until we put it in context. An example of a molecule: a block of filters; the same questions: what does it filter? What data? Within this component, it does not matter to us, because on one page it will filter the list of books, and on the other, it will filter the catalog of hand soap. An example of an organism: a product card in which we are not interested in a specific product, in the component we show only its photo with the name and price.

2. **Domain** - a category of components that reflect the domain area. And here we already speak the customer’s language according to the rules of DDD (Domain-driven design). The following 3 layers here are:

* Populations
* Ecosystems
* Pages.

Each of these components makes sense only within the framework of a specific application: the order form, the list of payment systems, the shopping cart, the list of goods. The name of the component contains its scope.

## Population layer

The name of this layer speaks for itself. A population is a collection of individuals (organisms) of the same species.

Take our product card from the example above. By grouping the sets of these cards in different ways, we get “most popular products”, “products of the day,” “product catalog,” “discount products.” However, they do not have to look the same, as a set of goods in a row of 4 items. They can be wrapped in a carousel or slider, have a table or a line view. Here your designer will disperse at his convenience, and the developer will not need to add if-conditions for each such presentation since each of them will be an independent component.

## Ecosystem layer

An ecosystem is a complex dynamic system that includes a conjunction of living organisms and their environment. All its components are closely linked. This is like a big pot, containing both small and large components, and atoms, and populations, all of which together serve one big purpose. For example, viewing a list of products, paying for selected products with the help of a payment system, viewing the terms of the transaction, editing data about the products, viewing seller’s contact details, etc. This is very strongly related to the domain area.

Ecosystems also have one more role to play, so I’m going to go a little bit further and talk about the pages.

Pages are actually pages. Full, complete pages that consist of other components. As a result of the development of all the previous layers, we already have a lot of pieces from which you can sculpt pages. And this is where I would like the page itself to have no styles of its own because it should be consistent with other pages and they should all be in the same style. Therefore, the page itself should not contain anything other than a set of components. It can be three, five, as many components as you want, which are represented by a simple enumeration. For example, the "About Us" page in its simplest version may contain three components: 1) the page header, 2) a description of the company with a feedback form and 3) a footer. In the complex version, you can add a popup widget for the hotline, a consent panel for the use of cookies, a component for collecting analytics, etc.

But the main criterion remains the cleanliness of the page component. Therefore, a reasonable question may arise: Where to put the page content? That’s the essence of it, without header and footer and other extra widgets. And it is easy to find an answer to it by answering another question: What is the content of a page? What is this if not an ecosystem that defines the main purpose of visiting this page. And this is where the important feature of the ecosystem just manifests itself: to reflect one of the business objectives of the application.

## Rules for naming layers from a domain category

In practice, when I had a lot of components of different levels, I needed to somehow learn how to navigate them quickly. How to distinguish an organism from an ecosystem? And a population from the page?

I introduced rules for naming each domain layer so that I could determine the level of a component by name. So, I added **_group** to the names of all populations, ecosystems got the **_space** ending, and the pages **_page** respectively.

It also helped me a lot with the repetitive names of the components that designate one entity but are at different levels. In the case of abstract levels (atoms, molecules, and organisms) due to the possible overlap of names, it is necessary to be very careful when choosing a name. And we all know that to come up with a good name for a function, component, process is a challenge!

## Where did the minerals come from?

Are the above layers I’ve just described enough? It seems that yes, and that could be the end. But in practice, I wanted to describe EVERYTHING in my style guide. And it turned out that static pictures, utility classes, base colors, fonts, and so on remained behind. It’s some kind of incomprehensible small things that can not be attributed to the components, but I want it to be in the style guide too.

And then I added another layer - a layer of minerals, small "inanimate" particles that go side by side with all the other components but are not components by themselves.

## So what is atomic design 2.0

This is an advanced atomic design methodology based on practical application, consisting of 7 levels:

1. minerals
2. atoms
3. molecules
4. organisms
5. populations (_group)
6. ecosystems (_space)
7. pages (_page)
   where DDD occupies an important place and there is a breakdown into **abstract components** (atoms, molecules, and organisms) and **domain components** (populations, ecosystems, and pages), i.e., semantic, related to the subject area. And auxiliary design elements are reflected in the layer of minerals.

## Finally

When we learn something new and only learn to take the first steps in some direction, we believe in the rules by which this "new" lives and develops. It is a necessary learning phase. But then, the more experience we have, the more we can judge the rules themselves and their appropriateness.

When the rules stop working, they just need to be changed to meet the conditions and needs that arise over time. Thus, the development of atomic design into something new, more multi-layered, and meaningful is a natural stage in the development of this methodology. And I am very glad that I was able to take it to the next level, consistent with the practical needs of developers and designers.
