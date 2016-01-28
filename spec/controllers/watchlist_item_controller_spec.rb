require 'rails_helper'

RSpec.describe WatchlistItemsController, type: :controller do

  let (:user) { User.create }

  before { session[:user_id] = user.id }

  describe "POST #add_to_watchlist" do
    it "creates a new watchlist item (adds a bird to the user's watchlist)" do
      post :add_to_watchlist, bird_name: "Snowy owl"
      expect(response.body).to match(/has been added to your watchlist/)
      bird = Bird.find_by(com_name: "Snowy owl")
      expect(user.birds).to include bird
    end

    it "returns a failure message if the bird name was invalid" do
      post :add_to_watchlist, bird_name: "human"
      expect(response.body).to match(/invalid bird name/)
      expect(Bird.find_by(com_name: "human")).to eq nil
    end
  end

end
