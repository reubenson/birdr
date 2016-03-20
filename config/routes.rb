Rails.application.routes.draw do

  get '/' => 'report_collection#create', as: 'root'
  post '/' => 'report_collection#create'

  get '/bird/sci_name' => 'bird#sci_name'
  resources :bird
  post '/add_to_watchlist' => 'watchlist_items#add_to_watchlist'
  resources :watchlist_items

  get '/login' => 'sessions#new'
  post '/login' => 'sessions#create'
  get '/logout' => 'sessions#destroy'
  get '/signup' => 'users#new'
  resources :users

end
