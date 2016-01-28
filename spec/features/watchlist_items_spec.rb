require 'rails_helper'

RSpec.feature "WatchlistItems", type: :feature do

  before(:each) do
    binding.pry
    @user = User.create
    page.set_rack_session(user_id: @user.id)
    # allow(current_user).to return
  end

  scenario "user can add a bird to their watchlist", js: true do
    visit '/'
    expect(page).not_to have_content('Add to your watchlist')

    fill_in 'search', with: "greater roadrunner"
    binding.pry
    expect(page).to have_content('Add to your watchlist')
    click_button 'Add to your watchlist'
    expect(page).to have_content("The greater roadrunner has been added to your watchlist")

    # visit user's page
    # click a link to the user's Watchlists
    # expect(page).to have_content("greater roadrunner")
    # expect(Watchlist.last.bird.com_name).to eq "greater roadrunner"
    # expect(page to show birds on the user's watchlist
  end
end
