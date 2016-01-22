require 'rails_helper'

RSpec.feature "NearestSightings", type: :feature do

  scenario "if a bird is not found nearby, then the user can click for the nearest location where the bird is found", js: true do
    visit '/'
    fill_in "search", with: "greater roadrunner"
    found_species = page.all('.select-species')
    found_species.each do |species|
      expect(species.has_css?(visible: true)).to eq false
    end

    expect(page.body).to include "The bird you are searching for hasn't been spotted near you"

    click_button "nearest-sighting-button"
    page.find("#species-list").should have_content("Greater Roadrunner")
  end

  scenario "user receives an alert msg if no match if found for the query", js: true do
    visit '/'
    fill_in "search", with: "human"
    found_species = page.all('.select-species')
    found_species.each do |species|
      expect(species.has_css?(visible: true)).to eq false
    end
    expect(page.body).to include "The bird you are searching for hasn't been spotted near you"

    click_button "nearest-sighting-button"
    alert_msg = page.driver.browser.switch_to.alert.text
    expect(alert_msg).to eq "No birds matched your search query"
  end
end
