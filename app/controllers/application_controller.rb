class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  helper_method def logged_in?
	  !!current_user
	end

	helper_method def current_user
	  begin
      @current_user ||= User.find(session[:user_id]) if session[:user_id] #memoized
    rescue
      # You probably forgot to log out before restarting the server!
      session[:user_id] = nil
      @current_user = nil
    end
	end

end
