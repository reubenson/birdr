require 'rails_helper'

RSpec.describe BirdController, type: :controller do
  describe "GET #sci_name" do
    it "takes a bird's common name and returns its scientific name when common name is valid"  do
      get :sci_name, searched_name: "snowy owl"
      json_response = JSON.parse(response.body)
      expect(json_response["success"]).to eq true
      expect(json_response["text"]).to eq "Bubo scandiacus"
    end

    it "returns an error if there is no match for query"  do
      get :sci_name, searched_name: "human"
      json_response = JSON.parse(response.body)
      expect(json_response["success"]).to eq false
      expect(json_response["text"]).to eq "No birds matched your search query"
    end

  end
end
