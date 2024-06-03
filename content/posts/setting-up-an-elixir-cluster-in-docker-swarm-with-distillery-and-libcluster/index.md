---
ceoTitle: Building Elixir Cluster with Docker Swarm, Distillery, Libcluster
title: Setting up an Elixir Cluster in Docker Swarm with Distillery and Libcluster
breadcrumbs: Setting up an Elixir Cluster in Docker Swarm with Distillery and Libcluster
slug: setting-up-an-elixir-cluster-in-docker-swarm-with-distillery-and-libcluster
draft: false
publishDate: 2019-07-05T00:00:00.000Z
image: Docker-swarm-tutorial.jpg
og_image: Docker-swarm-tutorial.jpg
description: In this tutorial we'll explore the creation of an Elixir app
  cluster that is run in Docker Swarm and does properly maintain node
  connectability as the swarm scales up and down.
promote:
  promote: false
top: false
authors:
  - alexey-olefirenko
categories:
  - development
industries: []
---
In this tutorial we'll explore the creation of an Elixir app cluster that is run in Docker Swarm and does properly maintain node connectability as the swarm scales up and down.

## Intro + tools

Erlang is a mature programming language that has been used in production for more than three decades. It was not extremely popular
but had some distinctive features built-in into the language and its default set of libraries (OTP). Built for reliability and concurrency,
with its process system and "let it crash" philosophy, Erlang also had a built-in clustering support, called <a href="http://erlang.org/doc/reference_manual/distributed.html" target="_blank">Distributed Erlang</a>.

Elixir is built on top of Erlang and uses the same VM (BEAM) for functioning. It brings metaprogramming and modern-looking code syntax to Erlang ecosystem, at the same time providing
all the great things built into Erlang initially.

Docker Swarm is a production-ready container orchestration system that is basically a set of Docker Engine applications that do work in a cluster.

While Kubernetes is becoming more and more popular over the latest years, Docker Swarm is far simpler, but still does its main purpose (managing containerized applications across nodes) very well.

It is very similar to docker-compose in terms of configuration, so it's not difficult to set up a swarm for those who have some experience with compose files.

<a href="https://github.com/bitwalker/distillery" target="_blank">Distillery</a> is an Elixir library for building application releases, it has become a de-facto standard in Elixir world.

## Main challenge of Erlang clusterisation setup

In order to have BEAM instances (also called Erlang nodes) connected on different machines, you need to know the IPs/hostnames for these machines before you start building a cluster. Throughout the years server provisioning was a "one-off" task, creating a connected network of several nodes was a standard practice but serious and dynamic change of their count was not planned. In the "modern world of IT" where software is usually run in containers you can not be sure that your VMs quantity is static.

Using a "container orchestrator" Kubernetes or Docker Swarm allows to scale services dynamically, adding and removing container instances "on-the-fly".

Regular ways of having nodes interconnected are: using ".hosts.erlang" <a href="http://erlang.org/doc/man/net_adm.html" target="_blank">file</a> or some external special tool as nodefinder.

Both of these approaches are not applicable if Docker Swarm is used, the file approach is static and the nodefinder uses UDP multicast to find sibling nodes while
the Docker's overlay network <a href="https://github.com/moby/libnetwork/issues/552" target="_blank">does not allow</a> multicast at all.

To make it possible to experiment with Swarm mode of Docker using a development machine, it is necessary to put Docker engine into Swarm mode first.

This is done by using the `docker swarm init` command. When the swarm is no longer needed, a command `docker swarm leave --force` will put the Docker engine back into
its normal state.

In order to have a functional cluster you need two things:

1. Make individual containerized BEAM nodes connectable
2. Set up node autodiscovery

All of the code-related steps mentioned in this guide are also available for exploring as a Git repo, with links to commits (`(commit)`) in appropriate sections.

## Making individual containerized Erlang nodes connectable

![Elixir Docker Distillery Guide](Elixir-docker-distillery-guide.jpg)

### Set up Distillery <a href="https://github.com/Anadea/elixir-cluster-docker-swarm-demo/commit/88551f7" style="color: #5666a1" target="_blank">(commit)</a>
In order to add Distillery into an Elixir project it is necessary to add it as a dependency into mix.exs, run `mix deps.get` to fetch it and `mix release.init` so
that the library creates its default config.

### Add Dockerfile <a href="https://github.com/Anadea/elixir-cluster-docker-swarm-demo/commit/868c48d" style="color: #5666a1" target="_blank">(commit)</a>

The Dockerfile was taken from <a href="https://hexdocs.pm/distillery/guides/working_with_docker.html" target="_blank">the Distillery guide</a> with minor changes related to hardcoding app name and version, as this is a simple demo app.

### Customizing Distillery

Erlang node can connect to any other network-discoverable node without extra configuration if it has the same Erlang cookie.

In order for a node to be discoverable it <a href="https://github.com/bitwalker/distillery/issues/338#issuecomment-334848537" target="_blank">needs</a> to have a valid hostname or IP.

This can be achieved by setting the node name to a special form in vm.args file which is used by Distillery.

The nodename in "long name" format consists of given app name and host node name, separated by "@". App name can be any string, by default Distillery uses "release_name" and it's OK.

Host node name is the one that needs correction, as it is 127.0.0.1 by default. As it was stated before, this name should be a resolvable entity. By default containers in a docker swarm live in a subnet and are accessible over the swarm's ingress network. So if you know the IP of the container, it should in general be accessible from any other container of the same service if you use this IP.

In order to fill the vm.args file with a real hostname of the container it is necessary to do the following:

#### 1. <a href="https://github.com/Anadea/elixir-cluster-docker-swarm-demo/commit/9d90104" style="color: #5666a1" target="_blank">(commit)</a> create a special Distillery hook that will create an environment variable with container's IP.

Create a directory hooks/pre_configure.d directory in rel/ and add the following file named generate_vm_args.sh there:

```bash
#!/usr/bin/env bash
# hooks/pre_configure.d/generate_vm_args.sh
export CONTAINER_IP=$(hostname -i)
```

Make it executable by running
`chmod +x rel/hooks/pre_configure.d/generate_vm_args.sh`

And finally add it to Distillery hooks by inserting `set pre_configure_hooks: "rel/hooks/pre_configure.d"` line into the environment you want in rel/config.exs.

#### 2. <a href="https://github.com/Anadea/elixir-cluster-docker-swarm-demo/commit/a324283" style="color: #5666a1" target="_blank">(commit)</a> use this new environment variable in the vm.args file for the long node name.

The name section may look as the following:

```bash
## Name of the node
-name <%= release_name %>@${CONTAINER_IP}
```

The "${}" syntax in the vm.args file does work because the Dockerfile has `ENV REPLACE_OS_VARS=true` option set. This environment variable will allow "${CONTAINER_IP}" to be replaced by the value that is calculated in generate_vm_args.sh so the Erlang node will have a proper name set.

In order to check if the nodes can be really connected after these steps it is necessary to deploy the application in swarm mode.

Docker engine should be set to swarm mode and a stack must be created and deployed.

It is necessary to build the application's image, create a stack and deploy it there.
Use `docker build -t cluster_demo:latest .` command for building the image and `docker stack deploy -c stack.yml t` for creating and deploying the stack.

Both of these commands should be run from the application's folder.

After the mentioned steps if you run `docker ps`, you should see two containers with the app running, for example:

```bash
CONTAINER ID    IMAGE         COMMAND         CREATED       STATUS       PORTS        NAMES
f68ad9962299    cluster_demo:latest  "/bin/sh -c 'trap 'e..."  36 seconds ago   Up 34 seconds              t_cluster_demo.2.fnh0516pjga46sgspj8zq49vz
13d6700bedcc    cluster_demo:latest  "/bin/sh -c 'trap 'e..."  36 seconds ago   Up 34 seconds              t_cluster_demo.1.p9eajxecwrlj7dzx94fkp2wab
```

In order to test out network connectivity it's necessary to see both nodes names.

Let's connect to first container's application via remote console and try to connect it to the second one. We need to know IP of the second container in order to construct its hostname, it can be determined by the following command: `docker exec -it 13d6700bedcc hostname -i`. It is "10.0.0.3" in my case.

The command for connecting to the first container's remote console would be `docker exec -it f68ad9962299 bin/cluster_demo remote_console`.

This command should give a standard iex console output like the following:

```bash
Erlang/OTP 21 [erts-10.3.5.3] [source] [64-bit] [smp:2:2] [ds:2:2:10] [async-threads:1] [hipe]
Interactive Elixir (1.8.2) - press Ctrl+C to exit (type h() ENTER for help)
iex(cluster_demo@10.0.0.4)1>
```

Elixir has a set of functions related to multi-node operations, stored in <a href="https://hexdocs.pm/elixir/Node.html" target="_blank">Node</a> module.

If "Node.list" is called in the remote console, it will return an empty list as the Erlang node in the first container does not "know" of the one in the second container.

```bash
iex(cluster_demo@10.0.0.4)1> Node.list
[]
```

In order to connect to the second container the following command can be used: `Node.connect(:"cluster_demo@10.0.0.3")`

```bash
iex(cluster_demo@10.0.0.4)2> Node.connect(:"cluster_demo@10.0.0.3")
true
```

True return value means that connection succeeded. If "Node.list" is run again, it will have the second node in results now:

```bash
iex(cluster_demo@10.0.0.4)3> Node.list
[:"cluster_demo@10.0.0.3"]
```

Both nodes do know of the connection now, so running a remote console (`docker exec -it 13d6700bedcc bin/cluster_demo remote_console`) on the second node should list the first one now:

```bash
Erlang/OTP 21 [erts-10.3.5.3] [source] [64-bit] [smp:2:2] [ds:2:2:10] [async-threads:1] [hipe]
Interactive Elixir (1.8.2) - press Ctrl+C to exit (type h() ENTER for help)
iex(cluster_demo@10.0.0.3)1> Node.list
[:"cluster_demo@10.0.0.4"]
```

Nodes can see each other as well as connect but this is all done in manual mode. The next section will cover autodiscovery.

## Setting up node autodiscovery <a href="https://github.com/Anadea/elixir-cluster-docker-swarm-demo/commit/4466b66" style="color: #5666a1" target="_blank">(commit)</a>

![How to set up node autodiscovery with Libcluster](How-to-set-up-node-autodiscovery-with-Libcluster.jpg)

The next step is making the system discover other nodes automatically and maintaining their availability list. Docker has a "not-very-documented" feature of exposing IPs of all instances (called tasks) of a given service by performing a DNS lookup of "tasks.<service-name>" (see <a href="https://docs.docker.com/network/overlay/" target="_blank">Docker docs: Use overlay networks guide</a> -> "Container discovery" section). It could be possible to write a small piece of code
that makes this DNS lookup at application startup and tries to connect to all of the containers that are available by the lookup output, but, fortunately there is a library that does all those tasks.

It is <a href="https://github.com/bitwalker/libcluster" target="_blank">Libcluster</a> made by Bitwalker, author of Distillery. There are different strategies for container discovery listed there, most of which are for Kubernetes but there is one that is exactly for the DNS variant used in Docker Swarm (while it is not listed in Readme or docs, it is present in <a href="https://github.com/bitwalker/libcluster/blob/master/lib/strategy/dns_poll.ex" target="_blank">source code</a> and is properly documented there).

So, in order for autodiscovery to work, it is necessary to add libcluster to application's deps and supervision tree. Here is the line for the supervision tree:

```bash
{Cluster.Supervisor, [swarm_dns_poll: [
      strategy: Cluster.Strategy.DNSPoll,
      config: [
       query: "tasks.<your_swarm_service_name>",
       node_basename: "<your_app_name_from_nodename>"]]]]}
```

Be careful giving the "query" option as it includes not only app name but a more qualified stack+service name, which is "t_cluster_demo" in the demo app.

To check if everything works properly, it is necessary to rebuild and redeploy the app. Rebuilding is still done via `docker build -t cluster_demo:latest .`.

If you did not shut down the cluster earlier, updating the stack can be still done with the command `docker service update --force t_cluster_demo`. Or you can remove the stack at all and create a new one using the perviously mentioned `docker stack deploy -c stack.yml t`.

After the update, output of `docker ps` looks as the following:

```bash
CONTAINER ID    IMAGE         COMMAND         CREATED       STATUS       PORTS        NAMES
ff37e0987e09    cluster_demo:latest  "/bin/sh -c 'trap 'e..."  38 seconds ago   Up 25 seconds              t_cluster_demo.2.xxebkzq9wfxq3qua1o0ucaxxk
94f81a7b4b25    cluster_demo:latest  "/bin/sh -c 'trap 'e..."  53 seconds ago   Up 40 seconds              t_cluster_demo.1.z5rpo4hii5220kgzgmha6c1uq
```

In order to see if the nodes have already discovered each other, it is possible to use the same commands as before, just using the new container IDs for the queries:

```bash
docker exec -it ff37e0987e09 bin/cluster_demo remote_console
Erlang/OTP 21 [erts-10.3.5.3] [source] [64-bit] [smp:2:2] [ds:2:2:10] [async-threads:1] [hipe]
Interactive Elixir (1.8.2) - press Ctrl+C to exit (type h() ENTER for help)
iex(cluster_demo@10.0.0.17)1> Node.list
[:"cluster_demo@10.0.0.16"]
```

The first node has successfully discovered the second one without any extra configuration or steps.

It will be also useful to check how cluster works in the case of dynamic change of nodes count. In order to change it, set the service scale to some other value, for example `docker service scale t_cluster_demo=5`.

After execution of this command, the `docker ps` output looks like the following:

```bash
CONTAINER ID    IMAGE         COMMAND         CREATED       STATUS       PORTS        NAMES
e5023450a421    cluster_demo:latest  "/bin/sh -c 'trap 'e..."  9 seconds ago    Up 7 seconds              t_cluster_demo.3.5m6bx8n0ahcx64iuaeizgaqne
3b3e1a935872    cluster_demo:latest  "/bin/sh -c 'trap 'e..."  9 seconds ago    Up 7 seconds              t_cluster_demo.4.ohlnxc1btzi8su3rxhvar7eel
32c9959a6fa7    cluster_demo:latest  "/bin/sh -c 'trap 'e..."  9 seconds ago    Up 7 seconds              t_cluster_demo.5.tyc91qfji865ecp08fn8mciju
ff37e0987e09    cluster_demo:latest  "/bin/sh -c 'trap 'e..."  7 minutes ago    Up 6 minutes              t_cluster_demo.2.xxebkzq9wfxq3qua1o0ucaxxk
94f81a7b4b25    cluster_demo:latest  "/bin/sh -c 'trap 'e..."  7 minutes ago    Up 7 minutes              t_cluster_demo.1.z5rpo4hii5220kgzgmha6c1uq
```

On using the same command `docker exec -it ff37e0987e09 bin/cluster_demo remote_console` and calling Node.list in the console a new set of nodes will be shown:

```bash
Erlang/OTP 21 [erts-10.3.5.3] [source] [64-bit] [smp:2:2] [ds:2:2:10] [async-threads:1] [hipe]
Interactive Elixir (1.8.2) - press Ctrl+C to exit (type h() ENTER for help)
iex(cluster_demo@10.0.0.17)1> Node.list
[:"cluster_demo@10.0.0.16", :"cluster_demo@10.0.0.20",
 :"cluster_demo@10.0.0.19", :"cluster_demo@10.0.0.18"]
```

Scaling down the cluster will update the node list as well. Running a `docker service scale t_cluster_demo=3` command and `docker ps` afterwards gives the following container list:

```bash
CONTAINER ID    IMAGE         COMMAND         CREATED       STATUS       PORTS        NAMES
e5023450a421    cluster_demo:latest  "/bin/sh -c 'trap 'e..."  3 minutes ago    Up 3 minutes              t_cluster_demo.3.5m6bx8n0ahcx64iuaeizgaqne
ff37e0987e09    cluster_demo:latest  "/bin/sh -c 'trap 'e..."  10 minutes ago   Up 9 minutes              t_cluster_demo.2.xxebkzq9wfxq3qua1o0ucaxxk
94f81a7b4b25    cluster_demo:latest  "/bin/sh -c 'trap 'e..."  10 minutes ago   Up 10 minutes              t_cluster_demo.1.z5rpo4hii5220kgzgmha6c1uq
```

Using the same command (`docker exec -it ff37e0987e09 bin/cluster_demo remote_console`) to connect to that one container that survived all the scales and running Node.list there gives the following output:

```bash
Erlang/OTP 21 [erts-10.3.5.3] [source] [64-bit] [smp:2:2] [ds:2:2:10] [async-threads:1] [hipe]
Interactive Elixir (1.8.2) - press Ctrl+C to exit (type h() ENTER for help)
iex(cluster_demo@10.0.0.17)1> Node.list
[:"cluster_demo@10.0.0.16", :"cluster_demo@10.0.0.18"]
```

As it is seen, Libcluster properly handles autodiscovery of nodes, both when they are added or removed.

If you do not need the demo swarm cluster from this article anymore, it can be removed with the following command: `docker stack rm t`.

Switching Docker engine back to normal mode from Swarm is done with the command `docker swarm leave -f` (-f = --force because the node is the manager by default and manager can not leave the swarm without force).
