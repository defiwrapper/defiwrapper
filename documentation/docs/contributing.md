---
id: contributing
title: Contributing
---

# How to contribute

I'm really glad you're reading this, because we need volunteer developers to
help this project come to fruition.

## Getting Started

These instructions will get you a copy of the project up and running on your
local machine for development and testing purposes.

### Prerequisites

You will need `nvm` installed.

### Installing

After cloning/downloading this repository enable correct version of `Node`
by following command

```console
nvm use
```

> Note: This may take a while if you don't have the needed Node version installed.

Now you can setup the project by running:
```console
yarn install
```
This will setup all the needed dependencies from all the packages.

### Building

You can build all the packages by running:
```console
yarn build
```

Or you can specify particular package to build with:
```console
yarn build:defi-sdk
```

### Recipes 

You can run recipes to quickly test whether a query is working or not

Ex: You can run `ping` query of coingecko polywrapper by running following command inside coingecko directory

```console
yarn recipes ping
```

> Note: If you don't specify any specific query it will run all the queries by default

### Testing

You can run all tests with following command

```console
yarn test
```

Or run test of a particular package by changing current working directory to the root directory 
of that package and running `yarn test`.

### Linting
You can lint all the packages with following command
```console
yarn lint
```
If you found any issues while linting, you maybe able to auto fix them with following command
```console
yarn lint:fix
```

### Formatting
You need to format the code according to our coding style standard. 
Don't worry we don't tell you to do it manually, We have a handy command for that.

```console
yarn format
```

## Adding EVM networks

- Follow this [quick tutorial](https://github.com/defiwrapper/defiwrapper/blob/main/packages/defi-sdk/README.md)


## Submitting changes

Please send a
[GitHub Pull Request to defiwrapper](https://github.com/Niraj-Kamdar/defiwrapper/pull/new/master)
with a clear list of what you've done (read more about
[pull requests](http://help.github.com/pull-requests/)). When you send a pull
request. We can always use more test coverage. Please follow our coding
conventions (below) and make sure all of your commits are atomic (one feature
per commit).

Always write a clear log message for your commits. One-line messages are fine
for small changes, but bigger changes should look like this:

```bash
    $ git commit -m "A brief summary of the commit
    >
    > A paragraph describing what changed and its impact."
```

## Coding conventions

Start reading our code and you'll get the hang of it. We optimize for
readability:

- We indent using two spaces
- We ALWAYS put spaces after array items and method parameters (`[1, 2, 3]`, not
  `[1,2,3]`), around operators (`x += 1`, not `x+=1`), and around hash arrows.
- This is open source software. Consider the people who will read your code, and
  make it look nice for them. It's sort of like driving a car: Perhaps you love
  doing donuts when you're alone, but with passengers the goal is to make the
  ride as smooth as possible.

Thanks, defiwrapper maintainer.
