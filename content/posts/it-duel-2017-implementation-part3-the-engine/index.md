---
ceoTitle: IT Duel 2017 Implementation - The Game Engine
title: 'IT Duel 2017: "Battle of the Bots - Hexagon" Creation of the Game - The
  Game Engine'
breadcrumbs: IT Duel 2017 - The Game Engine
slug: it-duel-2017-implementation-part3-the-engine
draft: false
publishDate: 2018-03-07T00:00:00Z
image: game-engine.jpg
og_image: game-engine.jpg
description: In the previous articles of the series we decided on the required
  playground functionality and prepared a [runtime infrastructure for game bots
  and
  sandboxes](https://anadea.info/blog/it-duel-2017-implementation-part2-digital-ocean-droplets-and-dokku-setup).
  It's time to actually program the game engine.
promote:
  promote: false
top: false
authors:
  - web-development-team
categories:
  - news
  - development
  - ruby-on-rails
industries: []
---
In the previous articles of the series we decided on the required playground functionality and prepared a [runtime infrastructure for game bots and sandboxes](https://anadea.info/blog/it-duel-2017-implementation-part2-digital-ocean-droplets-and-dokku-setup). It's time to actually program the game engine. As the main tools we will use [RoR](https://anadea.info/services/web-development/ruby-on-rails-development) and Sidekiq on the backend, ReactJS and WebSocket on the frontend.

## Prepare dependencies for the task queue

Let's add <a href="https://github.com/mperham/sidekiq" target="_blank">sidekiq</a> to our Ruby on Rails application. During the tournament we will need to process a lot of game battles between bots, and it would be nice to perform the games calculation in multithreaded mode, with the horizontal scaling possibility in case of need. The delayed tasks queue, processed by the worker processes pool, is a simple and effective way to achieve this.

Use <a href="https://github.com/endofunky/sidetiq" target="_blank">side**t**iq</a> as the manager for periodic tasks. In the game engine there will be implemented a single periodic task, performed every 15 seconds, responsibility of which is to summarize the current games round and prepare the next round.

It is worth noting that the periodic task in the *sidetiq* implementation is nothing more than the periodic addition of the same delayed task. We will prevent duplication of this task using <a href="https://github.com/mhenrixon/sidekiq-unique-jobs" target="_blank">sidekiq-unique-jobs</a> gem.

## Let's learn how to order and remove DigitalOcean droplets for players based on the image we prepared

A <a href="https://github.com/digitalocean/droplet_kit" target="_blank">droplet_kit</a> with a small add-on will help us:

~~~ruby
class DropletClient
 # The name of master SSH key in the DigitalOcean panel
 SSH_KEY_NAME = 'fourcolor'.freeze

 # API token and name of DigitalOcean image for bots
 def initialize(access_token, image_name)
  @access_token, @image_name = access_token, image_name
 end

 # Generate a unique name for the created droplet,
 # using the value of the auto-increment primary key from the database
 def name(local_id)
  "#{@image_name}-#{Tournament::CURRENT_SANDBOX}-#{local_id}"
 end

 # Creating a droplet based on the prepared image,
 # along with this put the master SSH key into the root user
 def create(name)
  droplet = client.droplets.create(DropletKit::Droplet.new(
   name: name,
   region: 'fra1',
   image: image,
   size: '1gb',
   ssh_keys: ssh_keys
  ))

  droplet.id
 rescue DropletKit::Error
 end

 # Removing a droplet
 def delete(id)
  client.droplets.delete(id: id)
  true
 rescue DropletKit::Error
  false
 end

 # Receiving an IP address of the created droplet
 # Remember that the IP becomes available 20-30 seconds
 # after the creation of the droplet
 def fetch_host(id)
  client.droplets.find(id: id).networks.v4.first&.ip_address
 rescue DropletKit::Error
 end

 private

 # client for DigitalOcean API
 def client
  @client ||= DropletKit::Client.new(access_token: @access_token)
 end

 # Identifier for DigitalOcean image
 def image
  @image ||= client.images.all.detect{|d| d.name == @image_name}.id
 end

 # Fingerprint for the master SSH key
 def ssh_keys
  @ssh_keys ||= client.ssh_keys.all
   .select{|k| k.name == SSH_KEY_NAME}
   .map(&:fingerprint)
 end

end
~~~

All operations with droplets are performed through delayed tasks, since the process, frankly speaking, is not instantaneous - *fetch_host* will start to return the droplet IP in 20 seconds after its *creation*:

~~~ruby
class Droplet < ApplicationRecord

 with_options unless: :imported? do
  after_commit :create_client_async, on: :create
  after_destroy :delete_client_async
 end

 # Mass order of droplets
 def self.mass_create!(count)
  transaction { count.times { create! } }
 end

 # Mass removing of droplets
 def self.mass_destroy!(ids)
  transaction { find(ids).count { |droplet| droplet.destroy } }
 end

 # Order a droplet on DigitalOcean, save its external identifier,
 # and schedule the delayed task for obtaining the IP address of the created droplet.
 # This method should be called solely from the delayed task.
 def create_client
  with_lock do
   unless client_id
    if self.client_id = DROPLET_CLIENT.create(name)
     save!
     FetchDropletJob.perform_later(id)
    else
     CreateDropletJob.set(wait: 10.seconds).perform_later(id)
    end
   end
  end
 end

 # Try to receive and save the droplet IP address,
 # in case of failure, schedule the corresponding delayed task one more time.
 # When restarting the delayed task, do not rely on the regular `job retry` feature,
 # It is better to re-schedule the task manually, in accordance with the principle
 # "normal business logic should not be based on raising of exceptions".
 #
 # This method should be called solely from the delayed task.
 def fetch_client
  with_lock do
   if client_id && !host
    if self.host = DROPLET_CLIENT.fetch_host(client_id)
     save!
    else
     FetchDropletJob.set(wait: 10.seconds).perform_later(id)
    end
   end
  end
 end

 private

 # Schedule delayed task for ordering a droplet
 def create_client_async
  CreateDropletJob.perform_later(id)
 end

 # Schedule a delayed task for removing a droplet
 def delete_client_async
  DeleteDropletJob.perform_later(client_id) if client_id
 end

end
~~~

The code for pending tasks is fairly primitive, as it should be:

~~~ruby
class SystemJob < ActiveJob::Base
 queue_as :default
end

class CreateDropletJob < SystemJob
 def perform(droplet_id)
  Droplet.find(droplet_id).create_client
 end
end

class FetchDropletJob < SystemJob
 def perform(droplet_id)
  Droplet.find(droplet_id).fetch_client
 end
end

class DeleteDropletJob < SystemJob
 def perform(droplet_client_id)
  Droplet.delete_client(droplet_client_id)
 end
end
~~~

## Teams registration in the admin panel

The list of teams management is an ordinary CRUD, with using <a href="https://github.com/stokarenko/dynamic-fields-for" target="_blank">dynamic-fields-for</a> when building a list of players.

To generate login tokens (and in the future - also to generate the identifiers for games and replays) we will use the wonderful library <a href="https://github.com/peterhellberg/hashids.rb" target="_blank">hashids</a>. Since this token generation algorithm is reversible, we do not need to store tokens in the database. In addition, if we use *SECRET_KEY_BASE* as the "salt" of the algorithm, we can, if desired, invalidate all tokens simultaneously with the sessions:

~~~ruby
class Team < ApplicationRecord
 # Initiate a token generator
 HASHIDS = Hashids.new(
  Rails.application.secrets[:secret_key_base] + 'Team',
  16,
  ('A'..'Z').to_a.join
 )

 # Generating a token based on the primary key value
 def auth_token
  @auth_token ||= HASHIDS.encode(id)
 end

 # Readable token - break it into 4 symbols, combine through a hyphen
 def auth_token_humanized
  auth_token.scan(/.{4}/).join('-')
 end

 # Search for a record in the database by a token
 def self.find_by_auth_token(token)
  find_by_id(HASHIDS.decode(token.to_s))
 rescue Hashids::InputError
 end

end
~~~

### Printing the team flyer

Let's give the admin the ability to print the team flyer directly from the page with the list of teams or from the team edit page, without reloading the page. The task is solved using the *iframe* in the *layout* template:

~~~haml
!!!
%html
 %body
  -# any custom markup
  yield

  -# iframe with a special data attribute
  %iframe{ src: flash[:print], data: {'print-target' => true} }
~~~


Hide iframe with styles:

~~~css
[data-print-target] {
 display: none;
}
~~~

Revive the iframe using the coffee script:

~~~coffee
$(document).on 'turbolinks:load', ->
 # Automatically open the system dialog box of a printer
 # when loading something into the iframe
 $('[data-print-target]').on 'load', (event) ->
  event.target.contentWindow.print() if $(event.target).attr('src')

$ ->
 $(document).on 'click', 'a[data-print]', (event) ->
  # Load link addresses from the "print" data attribute
  # not into the main browser window, but in the iframe
  $('[data-print-target]').get()[0].src = $(event.target).parent().attr('href')
  event.preventDefault()
~~~

Now you can print the response of any endpoint from an arbitrary location in the application:

~~~ruby
# Printing from the view
link_to teams_manage_path(resource), data: {print: true} do
 %i.material-icons print

# Printing from the controller
# print_and_new - this is the name of one of the submit buttons on the edit form.
# To recognize the clicking on a particular button, use the well-known trick -
# instead of showing in the template several submit buttons
# with the same name attribute, and painful recognition in the controller
# of a specific button by the value attribute
# (multilingual, icon instead of text, etc.) - each button is given a unique name,
# and in the controller a corresponding CGI parameter is recognized
# by the fact that it is there, whatever its actual value is
if params[:print_and_new]
 flash[:print] = teams_manage_path(@resource)
 redirect_to action: :new
else
 redirect_to action: :index
end
~~~

## Adding the player's SSH key to the team droplet

The players enter their public SSH key into the form on the sandbox site, then this key will be used to deploy new bot releases into the gameplay droplet. Remember that in the sandbox container there is already a private master SSH key, and in the droplets with bots the public master SSH key is put in the root user - it should work!

When validating the SSH key format, <a href="https://github.com/bensie/sshkey" target="_blank">sshkey</a> will help us:

~~~ruby
class Droplet < ApplicationRecord
 def add_ssh_key(key)
  # player's public SSH key comes from user input - validate carefully!!!
  return :blank if key.blank?
  return :wrong unless SSHKey.valid_ssh_public_key?(key)

  # escape the key (!!!), and add it to the dokku user in a player's droplet
  `echo #{key.shellescape} | ssh -oStrictHostKeyChecking=no -oUserKnownHostsFile=/dev/null root@#{host} "sudo sshcommand acl-add dokku [player]"`

  # Check the exit code of the last shell command
  $?.to_i == 0 ? :ok : :error
 end
end
~~~

Apparently, without *SSHKey.valid_ssh_public_key?* and *key.shellescape*, we would provide an opportunity for anyone who wants to execute an arbitrary shell script using the SSH key input form, with all the consequences () =) ;;;;>

## Mechanics of rounds calculation

As the main loop of the game engine, we implement a periodic task that runs every 15 seconds.

~~~ruby
class RoundWorker
 include Sidekiq::Worker
 include Sidetiq::Schedulable

 # Disable the regular retry, turn on the task uniqueness in the queue
 sidekiq_options(
  retry: false,
  unique: :until_and_while_executing
 )

 # Set the task periodicity
 recurrence { minutely.second_of_minute(0, 15, 30, 45) }

 def perform
  # Wait for the round calculation completion
  unless Game.pending.any?
   finish_previous_rounds
   delete_marked_teams
   prepare_tournament
   apply_events
   prepare_next_round
  end
 end

  # Finalize the calculated round
 def finish_previous_rounds
  Round.finish_pending
 end

 private

 # Delete the teams marked for deletion by the admin -
 # for application health it is safer to do it between rounds
 # but not in the middle, when the team is involved in the games calculation
 def delete_marked_teams
  Team.destroy_marked!
 end

 # Prepare the tournament as a whole -
 # open the game interface instead of promo page stub, reset team points,
 # initiate the game events queue.
 #
 # The method performs useful work at the end of the countdown
 # to the tournament start on the promo page, as well as when the administrator
 # restarts the tournament manually.
 def prepare_tournament
  Tournament.instance.prepare!
 end

 # Apply game events, if the term of their entry into the game has come
 def apply_events
  Event.apply!
 end

 # Prepare the next round for the calculation,
 # schedule the delayed tasks for calculating specific games.
 def prepare_next_round
  Round.prepare!
 end

end
~~~

This worker waits until all the games of the round have finished, then performs a series of actions …


### RoundWorker#finish_previous_rounds

Give the teams points for the games in the current round, mark the round as "finished":

~~~ruby
class Round < ApplicationRecord

 scope :pending, -> { where(pending: true) }

 def self.finish_pending
  pending.lock.each do |round|
   transaction do
    Score.calculate(round)

    round.update_attributes! pending: false
   end
  end
 end
end
~~~

### RoundWorker#delete_marked_teams

Instead of thinking about how the engine will be affected by the immediate team removal (crashed the delayed tasks of games calculation, WEB interface update, etc.) - the admin only marks the team for deletion, the actual deletion occurs when the current round ends:

~~~ruby
class Team < ApplicationRecord

 scope :for_delete, -> { where(for_delete: true) }

 def self.destroy_marked!
  for_delete.each do |team|
   team.destroy!
  end
 end

end
~~~

### RoundWorker#prepare_tournament

The administrator can restart the tournament - the actual restart occurs when the current round ends, just like the team removal:

~~~ruby
class Tournament < ApplicationRecord

 def prepare!
  start_from_beginning! if start_from_beginning?
 end

 private

 def start_from_beginning!
  transaction do
   # Clean the delayed tasks queue
   Sidekiq::Queue.new('game').clear

   # Bring the tournament attributes to the initial state
   update_attributes!(
    started: false,
    finished: false,
    start_from_beginning: false
   )

   # Clear game tables in the database
   [Game, Round, Score, RoundType].each(&:truncate!)

   # Cancel the game events which have already begun
   Event.update_all(applied: false)

   # Reset team points
   Team.all.each(&:create_initial_score)
  end

  # Clear statistics of the executed delayed tasks
  Sidekiq::Stats.new.reset

  # Notify the client via WebSocket about the need to reload the page.
  # In case the tournament start time is set in the future -
  # the game interface will be blocked by a promo stub page with a countdown
  # to the tournament start.
  LadderIndexChannel.broadcast(:reload)
 end

end
~~~

### RoundWorker#prepare_next_round

Let's prepare the next round.


~~~ruby
class Round < ApplicationRecord

 def self.prepare!
  # Round types are just a containers for game session parameters -
  # board size, points multiplier, etc.
  # The round type changes cyclically, one after another and in a circle.

  # Find the round type that was played in the previous round
  last_round_type_id = order(:id).last&.round_type_id || 0

  # Get the next round type
  round_type_scope = RoundType.order(:id)
  next_round_type = round_type_scope.where('id > ?', last_round_type_id).first ||
   round_type_scope.first

  if next_round_type
   transaction do
    # Create a new round
    round = create!(
     round_type_id: next_round_type.id,
     size: next_round_type.size,
     timeout_secs: next_round_type.timeout_secs,
     score_multiplier: next_round_type.score_multiplier
    )

    # Take all teams combinatorial combinations in two,
    # the combinations list is randomized to evenly distribute the load on bots
    Team.all.to_a.combination(2).to_a.shuffle!.each do |teams|
     # The first team in this pair will take the first move, thus -
     # randomize the array, depriving the gameplay of predictability
     teams.shuffle!

     # Create a game for a teams pair on the selected board type
     association_class(:games).create!(
      round: round,
      team1: teams[0],
      team2: teams[1],
     )
    end
   end
  end
 end

end
~~~

All created game sessions are placed in the delayed tasks queue for further calculation. In the process,
notify the client about a new match using WebSocket:

~~~ruby
class Game < ApplicationRecord

 after_commit :add_to_ladder_and_schedule, on: :create

 private

 def add_to_ladder_and_schedule
  [team1_id, team2_id].each do |team_id|
   LadderShowChannel.broadcast(team_id, :add_game, game: to_ladder(true))
  end

  GameJob.set(wait: 1.seconds).perform_later(id)
 end

end
~~~

## Calculation of the match

Finally, the most interesting! Program the game logic :)

To begin with, let's learn how to generate random game fields:

~~~ruby
class Board
 cattr_reader(:scaffolds) { {} }
 attr_reader :size, :cells

 # Generate the template for the game board with the required size,
 # it will include all the game elements (stones, empty cells,
 # the initial position of the players' chips) -
 # everything, except random additional stones.
 def self.scaffold(size)
  # The board templates are always the same
  # relative to the requested size of the field - memoize
  scaffolds[size] ||= begin
   cells_size = size * 2 - 1

   # Prepare an empty playing field
   cells = Array.new(cells_size) {
    Array.new(cells_size, 0)
   }

   # Here's how to "frame" the field by stones around the perimeter,
   # as a result, the remaining empty cells form a regular hexagon
   left_rocks = 0
   right_rocks = 0
   left_increment = size % 2 == 0

   (size-1).times do |i|
    left_increment ? left_rocks += 1 : right_rocks += 1
    left_increment = !left_increment

    [size-2-i, size+i].each do |ii|
     [
      *(0...left_rocks),
      *((cells_size - right_rocks)...cells_size)
     ].each do |jj|
      cells[ii][jj] = -1
     end
    end
   end

   # Put the initial players chips on the field
   cells[size-1][0] = 2
   cells[size-1][cells_size-1] = 1

   [0, cells_size-1].each do |i|
    cells[i][left_rocks] = 1
    cells[i][cells_size - right_rocks - 1] = 2
   end

   # Gather the empty cells coordinates into the array -
   # this will come in handy when "placing" random stones on the field
   empty_cells = cells_size.times.inject([]) { |mem, i|
    cells_size.times.inject(mem) { |mem, j|
     mem << [i, j] if cells[i][j] == 0
     mem
    }
   }

   # Calculate the optimal number for random stones
   additional_rocks_count = empty_cells.size / 10
   # Add one more random stone,
   # so that the total number of cells available for the game was odd -
   # minimize the draw chance
   additional_rocks_count += 1 if (empty_cells.size - additional_rocks_count).even?

   # The board template is ready!
   {
    cells: cells,
    empty_cells: empty_cells,
    additional_rocks_count: additional_rocks_count
   }.freeze
  end
 end

 # Actually, the random board generation
 def initialize(_size)
  @size = _size

  # Take the board template with the size asked for
  scaffold = self.class.scaffold(size)

  # Clone the template, place random stones on it
  @cells = scaffold[:empty_cells]
   .sample(scaffold[:additional_rocks_count])
   .inject(scaffold[:cells].deep_dup){ |mem, (i, j)|
    mem[i][j] = -1
    mem
   }
 end

end
~~~

Let's put the game logic into a couple of separate classes. Program with particular attention - these classes deal with the user input, it is here that players' moves are processed.

First, write a class that is responsible for the game field operations logic. There is a temptation to store the board state in the form of a two-dimensional array, in the same manner in which it is generated and sent to the bots. I admit, this option was implemented at the stage of prototyping, with all the consequences - for example, a complete search of the entire board when searching for available moves. In the release version, only the players' available moves were stored and maintained in the actual state - the code turned out to be nicer, the productivity increased two times (although I expected a more convincing increase...). So,


~~~ruby
class BoardSolver
 class WrongMove < StandardError; end

 # Cheap and cheerful - hardcode the differences in indexes
 # between the target cell and its neighbors
 NEIGHBOR_DELTAS = [
  # for cells from even-numbered rows
  [
   # Zero distance to neighbors - no neighbors.
   # Just write an empty array to use Array but not Hash,
   # and do not fuss with indexing
   [],
   # Distance to neighbors is equal to one cell, move type is reproduction
   [[-1,-1],[-1,0],[1,-1],[1,0],[0,-1],[0,1]],
   # distance to neighbors is equal to two cells, type of move - jump
   [
    [-1,-2],[-1,1],[1,-2],[1,1],[0,-2],[0,2],
    [-2,-1],[-2,0],[-2,1],[2,-1],[2,0],[2,1]
   ]
  # Similarly for cells from odd rows
  ],[
   [],
   [[-1,0],[-1,1],[1,0],[1,1],[0,-1],[0,1]],
   [
    [-1,-1],[-1,2],[1,-1],[1,2],[0,-2],[0,2],
    [-2,-1],[-2,0],[-2,1],[2,-1],[2,0],[2,1]
   ]
  ]
 ].freeze

 attr_reader :cells_size, :possible_moves, :jumps, :populates, :score

 def initialize(cells)
  @cells_size = cells.size

  # We will keep the possible moves data in the format
  # possible_moves[color][move_from][move_to] = distance
  # When filling possible_moves, we will ignore the number of available jumps.
  # Also, the presence of the move_from key in the @possible_moves[color] hash
  # indirectly indicates that the cell move_from is colored in color
  @possible_moves = Array.new(3){ {} }

  # For each game color, support information about available jumps,
  # taken moves of "reproduction" type, and game points
  @jumps, @populates, @score = 3.times.map{ {1 => 0, 2 => 0} }

  # Fill possible_moves[0] with empty cells -
  # it's impossible to make a move from them, but we will need
  # that indirect indication of an empty cell
  each_cell(cells) do |cell, color|
   possible_moves[color][cell] = {} if color == 0
  end

  # In fact, the starting chips are exposed to an empty board
  # with the help of the "reproduction" -
  # pass them through the generalized apply_changes method.
  each_cell(cells) do |cell, color|
   apply_changes([[*cell, 0, color]]) if (1..2).include?(color)
  end
 end

 # Applying board changes
 def apply_changes(changes)
  # Keep jumps and populates up to date
  _, _, old_color, new_color = changes.first

  # The situation when the cell is released by the first change -
  # a sign of a move like "jump"
  if new_color == 0
   # the jump is spent
   jumps[old_color] -= 1
  else
   # A move of the type "reproduction" is made
   populates[new_color] += 1
   # For every second reproduction the player receives one available jump
   jumps[new_color] += 1 if populates[new_color] % 2 == 0
  end

  changes.each do |i, j, old_color, new_color|
   cell = [i, j]

   # Keep score up to date
   score[old_color] -= 1 if old_color != 0
   score[new_color] += 1 if new_color != 0

   # The cell changes color,
   # so its previous owner can no longer make a move from it
   possible_moves[old_color].delete(cell)

   # The cell has ceased to be blank, so no one can make a move into it anymore.
   if old_color == 0
    possible_moves[1..2].each do |moves|
     moves.each do |_, to|
      to.delete(cell)
     end
    end
   end

   # The cell has a new color!
   possible_moves[new_color][cell] = {}
   neighbor_colors = new_color == 0 ? (1..2) : (0..0)

   neighbor_colors.each do |neighbor_color|
    (1..2).each do |distance|
     neighbors(cell, distance, neighbor_color).each do |neighbor_cell|
      color, from, to = new_color == 0 ?
       # the cell was released,
       # now neighboring players' chips can take a move into it
       [neighbor_color, neighbor_cell, cell] :
       # the cell is repainted in the player's color,
       # now the player can take a move from it
       # to neighboring empty cells
       [new_color, cell, neighbor_cell]

      possible_moves[color][from] ||= {}
      possible_moves[color][from][to] = distance
     end
    end
   end
  end
 end

 # An attempt to apply the player's move
 def apply_move!(color, move_from, move_to)
  # There is no need to check the format of incoming data
  # and the indexes entry in the board size -
  # possible_moves knowingly stores only valid moves in the correct format.
  # It is enough just to check the requested key presence in possible_moves.
  distance = possible_moves.dig(color, move_from, move_to)

  # The move is invalid because of an incorrect format,
  # the indexes falling outside the board,
  # or inadequacy of the move to the rules of the game
  raise WrongMove unless distance && possible_distance?(color, distance)

  opposite_color = self.class.opposite_color(color)

  # Create the changes array for the subsequent sending to the players
  neighbors(move_to, 1, opposite_color).map{ |i, j|
   # The enemy cells adjacent to the target cell of the move,
   # are recoloured in the color of the player
   [i, j, opposite_color, color]
  }.tap{ |changes|
   # The target cell is recoloured in the player's color
   changes.unshift([*move_to, 0, color])

   # The cell from which the move is made is released
   # if a move such as "jump" is made
   changes.unshift([*move_from, color, 0]) if distance == 2

   # Update the game data according to the calculated changes array
   apply_changes(changes)
  }
 end

 # There is at least one valid move for the player,
 # if there is at least one possible_moves entry for this player
 # with an allowable distance in terms of jumps
 def any_possible_move?(color)
  possible_moves[color].any? { |_, to|
   to.any?{ |_, distance|
    possible_distance?(color, distance)
   }
  }
 end

 # The distance of the move is always permissible for "reproduction",
 # for "jump" it is regulated by the value in the jumps hash
 def possible_distance?(color, distance)
  distance == 1 || jumps[color] > 0
 end

 # Just reversing the color
 def self.opposite_color(color)
  color == 1 ? 2 : 1
 end

 # Search for cells spaced a specified distance from the target,
 # and painted in the specified color
 def neighbors(cell, distance, color)
  # An excellent ruby trick for creating Enumerable objects,
  # with all the consequences
  return enum_for(:neighbors, cell, distance, color) unless block_given?

  NEIGHBOR_DELTAS[cell.first%2][distance].each do |deltas|
   # Get the neighboring cell indexes
   neighbor_cell = deltas.each_with_index.map{ |delta, index|
    cell[index] + delta
   }

   # Iterate an adjacent cell if its indexes are within the board,
   # and painted in the specified color
   yield(neighbor_cell) if indexes_inside_board?(neighbor_cell) &&
    possible_moves[color].key?(neighbor_cell)
  end
 end

 private

 # Just a utility method for iterating the original two-dimensional board
 def each_cell(cells)
  cells_size.times.each do |i|
   cells_size.times.each do |j|
    yield([i, j], cells[i][j])
   end
  end
 end

 # Checking the cell indexes for entering the dimensions of the board
 def indexes_inside_board?(cell)
  cell.all?{ |index| (0...cells_size).include?(index) }
 end
end
~~~

Great, it works! :) Now let's describe a class that implements the general gameplay:

~~~ruby
class Gameplay
 attr_reader :solver, :players, :current_player, :current_color, :game_over

 def initialize(board, *_players)
  # We will need to interact with the board
  @solver = BoardSolver.new(board.cells)

  # The array of players, the first of them makes the first move
  @players = _players
  @current_player = players.first

  # The game starts with color 1
  @current_color = 1

  # A flag that the game is over
  @game_over = false

  # Paranoia like it is.. )
  @mutex = Mutex.new
 end

 # Hash-mapping of the player's primary key to his game score
 def score_by_team_id
  players.map.with_index{ |p, i| [p.id, solver.score[i+1]] }.to_h
 end

 # The utility method for getting the loser player
 def looser
  points = solver.score.values.uniq

  points.size == 1 ?
   # Points are equal, a draw
   nil :
   players[solver.score.key(points.min)-1]
 end

 # An attempt to apply the player's move
 def apply_turn(player, move_from, move_to)
  @mutex.synchronize do
   # Check the possibility of the move from the general gameplay point of view
   check_move_possibility!(player)

   # Apply the move, get the changes array
   changes = solver.apply_move!(current_color, move_from, move_to)

   # Change the current player and the current color to opposite,
   # check if the end of the game is reached
   @game_over = true

   # The game is over if both players do not have valid moves
   2.times do
    @current_color = opposite_color
    @current_player = opposite_player

    if solver.any_possible_move?(current_color)
     @game_over = false
     break
    end
   end

   [:ok, changes]
  end
 rescue BoardSolver::WrongMove
  :wrong
 end

 private

 # The opposite color
 def opposite_color
  solver.class.opposite_color(current_color)
 end

 # The opposite player
 def opposite_player
  players.first == current_player ? players.second : players.first
 end

 # Only the current player can make a move, and only if the game is not over
 def check_move_possibility!(player)
  raise BoardSolver::WrongMove if game_over || player != current_player
 end

end
~~~

The match calculation code does not conceal in itself anything supernatural - many lines, the essence is mechanical work - just sit down and carefully code.

Some confusion in the code is a consequence of the fact that the same class is used for both synchronous and uncompromising game between two bots, and for the game between the training bot and the web user who plays asynchronously, has no timeouts and penalties for incorrect moves. An attempt was made to "straighten" the code with <a href="https://ruby-doc.org/core-2.5.0/Fiber.html" target="_blank">Fiber</a>, but it turned out that Fiber was losing its resume context (the consequence of the serialization-deserialization somewhere in the depths of ActionCable). I had to use <code>throw & catch</code>. There was neither time nor energy to refine the code in excess of the following.

Particular attention is paid to exceptional situations - this code deals with a user input, while it has a key impact on the tournament outcome.

For requests to the bots API, we use the extremely comfortable <a href="https://github.com/jnunemaker/httparty" target="_blank">httparty</a> library.

During the game session, remember the moves and key parameters of the playing board - it will come in handy for displaying replays.


~~~ruby
class GamePerformer

 include HTTParty
 format :json
 headers(
  'Content-Type' => 'application/json',
  'Accept' => 'application/json'
 )

 attr_reader :session_id, :gameplay, :board, :team1, :team2,
  :moves, :timeout_secs, :score_multiplier

 def initialize(game_id, _board, _team1, _team2, _timeout_secs = 1)
  @board, @team1, @team2, @timeout_secs = _board, _team1, _team2, _timeout_secs
  @session_id = Game.encode_hashid(game_id, team1.id)
  @gameplay = Gameplay.new(board, team1, team2)

  # In this array we will accumulate player moves for the replay
  @moves = []
 end

 # A special case of initiating an online game with a man
 def init_async
  [:create, game: {
   team1_id: team1.id,
   team1_name: team1.name,
   team2_id: team2.id,
   team2_name: team2.name,
   board: board,
   jumps: gameplay.solver.jumps
  }]
 end

 # A special case of starting an online game with a man
 def play_async(*args)
  catch(:async) do
   play(*args)
  end
 end

 # The main entry point into the game calculation
 def play(*args)
  # Catch the game over event
  looser, reason = catch(:game_over) do
   # Initialize the game for bots
   init if moves.empty?

   # Start the basic moves calculation loop
   turns(*args)
  end

  # Finalize the game for bots
  finish

  winner = case looser
   when team1.id then team2.id
   when team2.id then team1.id
   else nil
  end

  moves << {
   type: :game_over,
   reason: reason,
   winner: winner,
   score: gameplay.score_by_team_id.deep_dup,
   jumps: gameplay.solver.jumps.deep_dup
  }

  # Again dances around an asynchronous web player
  throw(:async, [:game_over, move: moves.last]) if team1.async || team2.async

  moves
 end

 # Send players a notification of the game over
 def finish
  unless moves.last[:type] == :game_over
   [team1, team2].each_with_index do |team, index|
    moves << {
     type: :delete,
     team: team.id,
     status: delete(team)
    } if moves[index][:type] == :create
   end
  end
 end

 private

 # Send players a notification of the game beginning
 def init
  teams = [team1, team2]

  teams.each do |team|
   moves << {
    type: :create,
    team: team.id,
    status: create(
     team,
     gameplay.current_player == team,
     teams.any?(&:async)
    )
   }
   check_move_status!(moves)
  end
 end

 # The main loop for players polling
 def turns(action = nil, move_from = nil, move_to = nil)
  while(true) do
   unless action == :updated
    team = gameplay.current_player
    color = gameplay.current_color

    # Request a move from the player
    status, move_from, move_to = team.async && action == :got ?
     [:ok, move_from, move_to] :
     get(team, color)

    moves << {
     type: :get,
     team: team.id,
     status: status,
     color: color,
     move_from: move_from.deep_dup,
     move_to: move_to.deep_dup
    }
    check_move_status!(moves)

    # Try to apply the player's move
    turn_status, changes = gameplay.apply_turn(team, move_from, move_to)
    if (turn_status == :wrong)
     if team.async
      # Forgive the wrong move to the web player
      moves.pop
      get(team, color)
     else
      # Punish the bot immediately for a wrong move
      moves.last[:status] = :wrong_move
      throw(:game_over, [team.id, :wrong_move])
     end
    else
     moves.last[:changes] = changes.deep_dup
     moves.last[:score] = gameplay.score_by_team_id.deep_dup
     moves.last[:jumps] = gameplay.solver.jumps.deep_dup
    end
   end

   # Send players a notification about the change in the board state
   move = moves.reverse.detect{ |m| m[:type] == :get }
   teams = team1.id == move[:team] ?
    [team1, team2] :
    [team2, team1]
   teams.shift if moves.last[:type] == :update

   teams.each do |team|
    status = team.async && action == :updated ?
     :ok :
     update(team, move)
    moves << {
     type: :update,
     team: team.id,
     status: status
    }
    check_move_status!(moves)
   end

   # Stack surface when the game is over
   throw(:game_over, [gameplay.looser&.id, :by_score]) if gameplay.game_over
   action = nil
  end
 end

 # A wrapper around all HTTP requests, for catching connection errors and timeouts
 def catch_errors
  yield
 rescue Net::OpenTimeout, Errno::ECONNREFUSED
  :no_connection
 rescue Net::ReadTimeout
  :timeout
 rescue
  :wrong_response
 end

 # POST request to a bot side containing information about the initial board
 def create(team, first_turn, training)
  return :ok if team.async

  catch_errors do
   raise 'Wrong!' unless self.class.post(droplet_url(team, false),
    timeout: timeout_secs,
    body: {
     id: session_id,
     board: board,
     jumps: gameplay.solver.jumps,
     first_turn: first_turn,
     training: training
    }.to_json
   ).parsed_response['status'] == 'ok'

   :ok
  end
 end

 # PUT request to a bot side containing information about board state changes
 def update(team, move)
  # Dancing around an asynchronous web player...
  if team.async
   # In this case, sleep is not a sign of a programmer's helplessness,
   # but a conscious delay after the web player's move -
   # otherwise the web player's move was visually merged
   # with the immediate response from training bot,
   # and monitoring the gameplay was extremely difficult
   sleep 0.5 unless move[:team] == team.id

   throw(:async, [:update, move: {
    type: :get,
    team: move[:team],
    color: move[:color],
    move_from: move[:move_from],
    move_to: move[:move_to],
    changes: move[:changes],
    score: move[:score],
    jumps: move[:jumps]
   }])
  end

  catch_errors do
   raise 'Wrong!' unless self.class.put(droplet_url(team),
    timeout: timeout_secs,
    body: {
     changes: move[:changes],
     jumps: move[:jumps]
    }.to_json
   ).parsed_response['status'] == 'ok'

   :ok
  end
 end

 # GET request to the side of bot, requesting another move
 def get(team, color)
  throw(:async, [:get, color: color]) if team.async

  catch_errors do
   response = self.class.get(droplet_url(team),
    timeout: timeout_secs,
    query: {color: color}
   ).parsed_response
   raise 'Wrong!' unless response['status'] == 'ok'

   [:ok, response['move_from'].map(&:to_i), response['move_to'].map(&:to_i)]
  end
 end

 # DELETE request to the side of the bot, giving notification of the game over
 def delete(team)
  return :ok if team.async

  catch_errors do
   raise 'Wrong!' unless self.class.delete(droplet_url(team),
    timeout: timeout_secs
   ).parsed_response['status'] == 'ok'

   :ok
  end
 end

 # URL for bot endpoint
 def droplet_url(team, with_session = true)
  "http://#{team.droplet.host}/games".tap{ |url|
    url.concat("/#{session_id}") if with_session
   }
 end

 # Immediately count the defeat to the player at any failure :)
 def check_move_status!(moves)
  throw(:game_over, [
   moves.last[:team],
   moves.last[:status]
  ]) unless moves.last[:status] == :ok
 end

end
~~~

Well, almost everything is ready on the backend, it's time to get busy with the frontend!

## Real time web interface update

Let's use WebSockets to notify the client about changes in the game world.

As an example, we will analyze the ladder page, that is, the tournament list of teams. The page should respond to:

* CRUD-actions of the administrator regarding the teams;
* Changes in teams scores, as a consequence - changing the order of teams in the ladder;
* Reaction to new releases.

Let's write a simple WebSocket channel controller:

~~~ruby
class LadderIndexChannel < ApplicationCable::Channel

 # Subscribe the client to the stream
 def subscribed
  stream_from self.class.stream_name
 end

 # Generate the stream name
 def self.stream_name
  'ladder_index'
 end

 # Sending a message to a stream
 # his method can be called from anywhere - models, controllers, delayed tasks, etc.
 def self.broadcast(action, options = {})
  ActionCable.server.broadcast(
   stream_name,
   options.merge(action: action)
  )
 end

end
~~~

Stepping aside and only as an example of a parametrized channel, we give the controller code for the page for monitoring the specific team:


~~~ruby
class LadderShowChannel < ApplicationCable::Channel

 def subscribed
  # Subscribe the client to the ladder general stream
  # On the client, respond to the page refresh command
  # when the tournament is restarted
  stream_from LadderIndexChannel.stream_name

  # Subscribe to the general channel for all teams.
  # It is used to update the chart with teams score dynamics.
  stream_from self.class.stream_name

  # Sign up to a specific team stream.
  # This is the stream that distributes information on the current team games.
  stream_from self.class.stream_name(params[:team_id])
 end

 # The parameterized stream name
 def self.stream_name(team_id = nil)
  "ladder_show".tap { |name|
    name << "_#{team_id}" if team_id
   }
 end

 # Sending a message to the team channel
 def self.broadcast(team_id, action, options = {})
  ActionCable.server.broadcast(
   stream_name(team_id),
   options.merge(action: action)
  )
 end

end
~~~

Let's return to the ladder page, start sending messages to the channel about the admin's actions in relation to the teams. The following code hardly needs the further comments:

~~~ruby
class Team < ApplicationRecord

 after_create :add_to_ladder
 after_update :update_in_ladder, if: -> { name_changed? || no_contest_changed? }
 after_destroy :remove_from_ladder

 private

 def add_to_ladder
  LadderIndexChannel.broadcast(:add_score,
   score: scores.last.to_ladder
  )
 end

 def update_in_ladder
  LadderIndexChannel.broadcast(:rename_score,
   team_id: id,
   name: name,
   no_contest: no_contest
  )
 end

 def remove_from_ladder
  LadderIndexChannel.broadcast(:remove_score,
   team_id: id
  )
 end

end
~~~

React to change in the team's score and to a new release (it was very convenient to keep the new release flag in the Score model to show the release moments on the dynamic scores chart):


~~~ruby
class Score < ApplicationRecord

 after_create :update_in_ladder
 after_update :release_to_ladder, if: :release_changed?

 private

 def update_in_ladder
  LadderIndexChannel.broadcast(:update_score,
   score: to_ladder
  )
 end

 def release_to_ladder
  LadderIndexChannel.broadcast(:new_release, score: {
   round_id: round_id,
   team_id: team_id,
   score: score,
   release: release
  })
 end

end
~~~

Everything is ready on the server side, let's deal with the client. Using the <a href="https://github.com/reactjs/react-rails" target="_blank">react-rails</a> library, write a couple of spiteful React components:

~~~js
var LadderIndex = React.createClass({

 componentDidMount() {
  // Establish WebSocket connection
  this.channel = App.cable.subscriptions.create('LadderIndexChannel', {
   received: (data) => {
    // Call a method corresponding to the action received from the channel,
    // if this method is declared
    this[data.action] && this[data.action](data)
   }
  });
 },

 componentWillUnmount() {
  // Close connection
  this.channel.unsubscribe();
 },

 reload(data) {
  // Respond to the page reload command
  location.reload()
 },

 update_scores(data) {
  // Respond to the command of teams scores upgrade,
  // send the data to the nested component
  this.refs.scores.update_scores(data.scores)
 },

 add_score(data) {
  // Respond to the scores upgrade command for a specific team,
  // send the data to the nested component
  this.refs.scores.add_score(data.score)
 },

 rename_score(data) {
  // Respond to the command for upgrading team attributes,
  // send the data to the nested component
  this.refs.scores.rename_score(data.team_id, data.name, data.no_contest)
 },

 remove_score(data) {
  // React to the command to remove the team,
  // send the data to the nested component
  this.refs.scores.remove_score(data.team_id)
 },

 new_release(data) {
  // React to the new release of the team,
  // send the data to the nested component
  this.refs.scores.new_release(data.score)
 },

 render() {
  // Display the nested component
  return (
   <div className="teams">
    <LadderIndexScores ref="scores" scores={this.props.scores} />
   </div>
  );
 }

});
~~~

~~~js
var LadderIndexScores = React.createClass({

 getInitialState() {
  // The initial ladder state is provided directly through the props
  return this.scores_to_state(this.props.scores)
 },

 update_scores(scores) {
  // Update teams scores
  this.setState(this.scores_to_state(scores))
 },

 scores_to_state(scores) {
  // Generate an object to update the state
  return {
   scores: _(scores).reduce((memo, score) => {
    memo[score.team_id] = score
    return memo
   }, {})
  }
 },

 add_score(score) {
  // Update scores for a single team
  let new_scores = React.addons.update(this.state.scores, {
   [score.team_id]: {$set: score}
  })

  this.setState({scores: new_scores})
 },

 rename_score(team_id, name, no_contest) {
  // Update the team attributes
  let new_scores = React.addons.update(this.state.scores, {
   [team_id]: { team_name: {$set: name}, team_no_contest: {$set: no_contest} }
  })

  this.setState({scores: new_scores})
 },

 remove_score(team_id) {
  // Delete a team
  let new_scores = _(this.state.scores).omit(team_id)

  this.setState({scores: new_scores})
 },

 new_release(score) {
  // Mark the team as having a fresh release
  let new_scores = React.addons.update(this.state.scores, {
   [score.team_id]: { release: {$set: score.release} }
  })

  this.setState({scores: new_scores})
 },

 scoreClass(score) {
  var classSet = 'mdl-list__item teams__list-item ';

  if (score.team_no_contest) {
   classSet = classSet + 'teams__list-item--no-contest';
  }

  return classSet;
 },

 render() {
  // Sort teams by descending scores
  let scores = _(this.state.scores).sortBy('position')

  // Show the tournament list
  return (
   <ul className="mdl-list teams__list">
    { _(scores).map((score, index) => {
     return (
      <li key={score.team_id} className={this.scoreClass(score)}>
       <i className="teams__place">{index+1}</i>
       <a className="teams__link" href={'/teams/ladder/' + score.team_id}>
        {score.team_name}
       </a>
       <span className="teams__score">{score.score}</span>
       {score.release && <span className="teams__release">New release!</span>}
      </li>
     )
    })}
   </ul>
  )
 }

});
~~~

It remains only to draw the LadderIndex component, and it will live its own life. Render directly from the Rails controller, with server-side precompilation:

~~~ruby
module Teams
 class LadderController < ApplicationController
  def index
   render component: 'LadderIndex', props: {
    scores: Score.to_ladder
   }
  end
 end
end
~~~

## Training bot

Let's write a training bot. This guy will be deployed from the very beginning of the tournament, but will not qualify for the prize. Its mission is to be an opponent in the online game, and also be a sparring partner for teams in the early stages of the tournament.

We will write in Ruby on Rails, in API-only mode. For a basis, take the <a href="https://github.com/Anadea/hexogon-templates/tree/master/ruby-ror" target="_blank">corresponding template</a>, update only the controller code and add one utility class. The algorithm is the most primitive, just to consciously finish the game, without violating the rules - a complete search of all available moves, counting the difference in chips after each move, choosing a random move from those that give the greatest difference in chips. At the same time, we will assess whether the programming problem is feasible for the players, that is, how long it takes for the bot implementation to be minimally meaningful.

Let's show the bot code as it is, raw. The controller looks exactly as it should:


~~~ruby
class GamesController < ApplicationController
 # A small trick is storing board states in a class variable, not in a file or DB,
 # that is, avoid serialization - the benefit is that the default web server *puma*
 # is multithreaded, rather than multi-process
 @@games = {}

 def create
  # There was a problem with *StrongParameters* in Rails,
  # I debugged and fixed it just a few hours before the event.
  # The symptom is an unreasonable processing time
  # of *POST* request on large boards (much beyond the timeout), with extremely
  # primitive implementation of the controller. The autopsy showed that *params*
  # for is not a *Hash* anymore o_O, the access to the value by the key
  # is implemented by a full search,
  # therefore each request by key in my case takes about 1ms.
  # In a normal application, this regrettable fact does not play a significant role -
  # there comes a bit of *CGI* parameters
  # (which means that the distance of the full search is not large),
  # the number of requests by key is insignificant. In our case,
  # if we iterate our cells gaming parameter directly from *params*
  # on a board of size 7 - we lose 170ms only for reading from
  # *params*. It is treated with *params.to_unsafe_h*.
  @@games[params[:id]] = Robot.new(
   params[:board].to_unsafe_h,
   params[:jumps].to_unsafe_h
  )

  render json: {status: :ok}
 end

 def show
  render json: {
   status: :ok,
  }.merge(
   @@games[params[:id]].turn(params[:color].to_i)
  )
 end

 def update
  @@games[params[:id]].update(params[:changes], params[:jumps].to_unsafe_h)
  render json: {status: :ok}
 end

 def destroy
  @@games.delete(params[:id])
  render json: {status: :ok}
 end

end
~~~

A brief, with no special frills, bot code:


~~~ruby
class Robot

 attr_reader :board, :jumps

 # Remember the initial state of the board
 # We will store the board in the original format, that is,
 # in a two-dimensional array
 def initialize(_board, _jumps)
  @board = _board['cells'].deep_dup
  @jumps = _jumps
 end

 # Apply changes to the board
 def update(changes, _jumps)
  changes.each do |i, j, _, new_color|
   board[i][j] = new_color
  end
  @jumps = _jumps
 end

 def turn(color)
  opposite_color = color == 1 ? 2 : 1

  # Transform the runtime complexity of the algorithm from quadratic to linear -
  # in one play on the board we group cells by colors.
  color_groups = (0...board.size).inject({}) { |mem, i|
   (0...board[i].size).inject(mem) { |mem, j|
    c = board[i][j]
    mem[c] ||= []
    mem[c] << [i, j]
    mem
   }
  }

  # Collect all possible moves
  moves = []

  # For all empty cells...
  color_groups[0].each do |to|
   # we are looking for such a chip of our color that...
   color_groups[color].each do |from|
    distance = cell_distance(from, to)
    # the distance of the given move is correlated with the rules of the game
    next if distance == :wrong || (distance == :jump && jumps[color.to_s] <= 0)

    # Calculate the value of the move, reproduction gives a +1 point by itself
    value = distance == :populate ? 1 : 0
    # Each enemy chip around the target cell gives +2 points,
    # since it is recoloured in our color -
    # the opponent loses one point, we get it
    value += neighbor_indexes(*to).count{ |i, j| board[i][j] == opposite_color} * 2

    moves << {move_from: from, move_to: to, value: value}
   end
  end

  # Choose "The Best" move
  choose_best(moves)
 end

 private

 def choose_best(moves)
  # Find the maximum value among all available moves
  best_value = moves.map{ |m| m[:value] }.max

  # Choose a random move from the most "valuable"
  moves.select{ |move| move[:value] == best_value }.sample
 end

 # Calculating the distance between two cells.
 # Do not ask why and how it works -
 # it was written in a hurry, in the "tournament" mode, the essence is the result of
 # fuss with paper and a pen :)
 def cell_distance(from, to)
  y_delta = if from[0] % 2 == to[0] % 2
   0
  elsif from[0] % 2 == 0
   -0.5
  else
   0.5
  end

  x_distance = (from[0] - to[0]).abs
  y_distance = (from[1] - to[1] + y_delta).abs

  distance = x_distance + y_distance

  if distance <= 1.5
   :populate
  elsif distance <= 2.5 || ( distance == 3 && x_distance == 2)
   :jump
  else
   :wrong
  end
 end

 # Search for nearby cells.
 # An easy way is just to hardcode the differences in the indexes
 # as we did in the BoardSolver class,
 # but I wanted to go to the trouble of doing it -
 # in order to compensate for the fact that I started writing a bot
 # already knowing the essence of the game for a week before.
 def neighbor_indexes(i, j)
  6.times.map { |edge_id|
   neighbor_i = i
   if edge_id == 0 || edge_id == 1
    neighbor_i -= 1
   elsif edge_id == 3 || edge_id == 4
    neighbor_i += 1
   end

   neighbor_j = j;
   if edge_id == 2 || (i % 2 == 1 && [1, 3].include?(edge_id) )
    neighbor_j += 1
   elsif edge_id == 5 || (i % 2 == 0 && [0, 4].include?(edge_id) )
    neighbor_j -= 1
   end

   (
    (0...board.size).include?(neighbor_i) &&
    (0...board[0].size).include?(neighbor_j)
   ) ? [neighbor_i, neighbor_j] : nil
  }.compact
 end

end
~~~

The training bot is ready - let's deploy it to a $10 droplet, the same as for all players. The response time for any request is ~3ms. In this case, the bot takes full participation in the tournament in four sandboxes at once, so in the worst case it was requested from 40 threads instead of the 10 usual for regular players, and no timeouts were observed throughout the whole tournament.

I will not disclose the exact time spent on writing this bot: a too small figure will look like bragging while too big one will mean my ineptitude - in any case, it won't be good. Let's just say that it was recognized that something like this can be written within the tournament time, and there should be time to try to implement something more intelligent, like <a href="https://en.wikipedia.org/wiki/Minimax" target="_blank">MiniMax</a>, for example.

## It's time to wrap it up

Behind the scenes, there is a huge amount of work - online game, replays, game events, real-time chart for the scores with release tags (perhaps the most exhausting, but a very spectacular feature!) and many small stuff.

In the final article, let's talk about how all this was tested - to be continued :)
