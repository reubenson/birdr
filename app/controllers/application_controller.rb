class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  def root
  	bird_connection = Adapters::EbirdConnection.new
  	@owls = bird_connection.query("Strix Varia")
  	@lat = @owls.first.lat
  	@lng = @owls.first.lng
  end

end
