class WatchlistItemsController < ApplicationController
  # verify login before each

  def add_to_watchlist
    binding.pry
    bird = Bird.find_by(com_name: params[:bird_name].capitalize)
    if !bird
      bird_sci_name = Bird.get_sci_name(params[:bird_name])
      if bird_sci_name
        bird = Bird.create(com_name: params[:bird_name].capitalize , sci_name: bird_sci_name)
      else
        render text: "invalid bird name"
        return
      end
    end
    current_user.birds << bird
    render text: "#{bird.com_name} has been added to your watchlist"
  end

  def create
    user = User.find(params[:user_id])
    bird = Bird.find_by(com_name: params[:bird_name].capitalize)
    if !bird
      bird_sci_name = Bird.get_sci_name(params[:bird_name])
      if bird_sci_name
        bird = Bird.create(com_name: params[:bird_name].capitalize , sci_name: bird_sci_name)
      else
        render text: "invalid bird name"
        return
      end
    end
    user.birds << bird
    render text: "#{bird.com_name} has been added to your watchlist"
  end

end
