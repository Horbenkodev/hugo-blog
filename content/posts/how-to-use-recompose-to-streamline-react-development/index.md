---
ceoTitle: "Streamlining React Development with Recompose: A How-To Guide"
title: How to Use Recompose to Streamline React Development
draft: false
publishDate: 2019-04-16T00:00:00.000Z
image: React-recompose.jpg
og_image: React-recompose.jpg
description: React's DRY coding tools have evolved over time, with developers
  avoiding inheritance-based solutions. Early React versions used mixins, which
  were simple JavaScript objects.
promote:
  promote: false
top: false
authors:
  - andrey-bakuta
categories:
  - development
industries: []
---
## Composition as a way to create reusable code

It's pretty exciting to observe how DRY coding tools in React were changing over time. And we must give credit to the developers - at no stage in the development of this library were any recommendations to use inheritance to solve such problems. In the early versions of React and React.createClass, there were mixins that were simple JavaScript objects. The result of applying them to a React component was quite predictable: the component got new properties and methods corresponding to the keys from the mixin object.

There was a bit more non-trivial logic when a mixin was used to extend lifecycle methods. Almost every library providing an implementation of Flux had a mixin that allowed you to quickly connect a component to the store. Actually, this is what is now being done with `connect`.

Then, ES6 came out. A new syntax for component creation has greatly influenced the ways of writing reusable code. JavaScript doesn't support multiple inheritance, thus the old-style patterns with mixins were rendered useless and the whole idea needed rethinking. One of the options could be creating long inheritance chains, however <a href="https://reactjs.org/docs/composition-vs-inheritance.html" target="_blank">inheritance was eventually deprecated</a>. Facebook released an <del>instruction</del> advice to use composition.

### HOC as a composition tool

For people familiar with OOP, composition is the ability to store a reference to an object of another class inside an object in some form (for example, in the field), i.e. to obtain the functionality of another class partially or completely. And what is called composition in <a href="https://anadea.info/services/web-development/react-js-development" target="_blank">React development</a> may confuse them.

The point is that in spite of the fact that React components are defined as JavaScript classes, in essence, they are more like functions. For functions, a native composition tool is a decorator (a higher-order function that takes a function and returns a function). In the case of React, this is a function that takes a component and returns a component, a.k.a. Higher Order Component (HOC).

```react
const withAuthorizedUser = Komponent => (
  props => {
   const user = getUser()
   if (user) {
     return <Komponent {…props} user={user} />
   } else {
     return <SignInPage {…props} />
   }
  }
)
//…
export default withAuthorizedUser(Dashboard)
```

Returning to the idea of multiple inheritance and mixins, it is curious to see how the composition of several HOCs looks like.

```react
export default withAuthorizedUser(withRouter(withGlobalConfig(connect(Dashboard))))
```

With Recompose (React HoC utility), the code above can be rewritten.

```react
import { compose } from ‘recompose'
const enhance = compose(
 withAuthorizedUser,
 withRouter,
 withGlobalConfig,
 connect
)
export default enhance(Dashboard)
```

Let's take a deeper look into how to use React Recompose.

### Making components functional - developing abstraction skills

<a href="https://github.com/acdlite/recompose" target="_blank">Recompose</a> lends itself as a lodash for React, so besides the possibility to create a composition of self-written HOCs, it also offers a wealth of its own ones to fit every taste.

We somehow naturally developed the following style of defining React components:

* first of all, we try to define a functional component;
* if it fails, we consider the possibility of inheritance from `PureComponent`;
* if this option doesn't work as well, then we define a class inherited from `Component`. That is, functions have higher priority than classes.

Recompose HOCs provide the ability to make pretty much every component functional. Everything that makes us define our components as classes is solved by using a set of higher-order components: determining the state and a set of methods for managing this state, defining event handlers, setting props values ​​by default, using lifecycle methods, and so on.

A typical example of using Recompose:

```react
const enhance = compose(
 inject(‘rootStore'),
 withProps(({ rootStore }) => ({ uiState: rootStore.uiStateStore })),
 withHandlers({
  activateSearch: ({ uiState}) => e => {
   uiState.toggleSearchActive(!uiState.isSearchActive)
   e.currentTarget.blur()
  },
  deactivateSearch: ({ uiState }) => () => {
   uiState.toggleSearchActive(false)
  }
 }),
 observer
)
// Named export without using the HOCs
// for testing or using within style guides
export const Search = ({ activateSearch, deactivateSearch, uiState }) => (
 // … typical jsx
)
// Default export for in-app use
export default enhance(Search)
```

One of the advantages of this approach is the separation of behavior and presentation with the possibility to reuse the first or the second part. The behavior is described through a composition of calls to higher-order components and stored in the `enhance` variable, while the presentation remains in the "stupid" component.

In the example above, we defined two handlers to activate and deactivate the search. If we needed another handler, let's say, for user input, then adding the third key `onFieldChange` after `deactivateSearch` would be quite a viable solution. However, we can make one more `withHandlers` in order to logically group handlers associated with different elements (certainly, this comes at the cost of deeper nesting in the React component tree).

In the case of a class, you can accomplish such grouping only syntactically, by placing the definitions for the methods associated with one entity, next to each other. Below is an example where all functions for working with DOM and ref are moved to a separate section.

```react
withHandlers(() => {
 let anchorRef
 return {
  registerAnchor: () => el => {
   anchorRef = el
  },
  scrollToAnchor: () => () => {
   anchorRef.scrollIntoView()
  }
 }
})
```

An important but unobvious advantage of this separation is that carrying out the behavior to a separate place becomes very native. If a component is a class, then any new behavior (e.g. work with DOM) will most likely be implemented as new class methods that will be put next to methods solving completely different tasks, for example, store initialization.

However, if the entire behavior of the component is already implemented through the composition of HOCs, then the most native action when adding new functionality is to add another HOC. There is a big chance that it will be universal enough (see the above example) to put it into a separate file for further reuse. Even if we don't reuse it, we will get a wonderful tool for "hiding" the implementation of behavior that is not directly related to solving the business problem for which the component was created. As for me, I don't want to see a code for processing events of window resizing in a component whose task is to display a list of products.

Although <a href="https://reactjs.org/docs/render-props.html" target="_blank">other patterns</a> for describing the logic of general behavior are gaining popularity, Recompose remains a great tool that can impact not only your coding style, but perhaps also your way of thinking.

We hope you enjoyed our React / Recompose tutorial. Keep reading our blog for more development tips and advice!
