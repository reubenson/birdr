require 'rails_helper'

RSpec.describe BirdController, type: :controller do

  describe "GET #sci_name" do
    it "takes a bird's common name and returns its scientific name"  do
      get :sci_name, searched_name: "snowy owl"
      expect(response.body).to eq "Bubo scandiacus"
    end
  end

end
