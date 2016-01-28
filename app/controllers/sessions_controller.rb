class SessionsController < ApplicationController

  def new
    @user = User.new
  end

  def create
    # @user = User.find_by(email_address: session_params[:email_address])
    @user = User.find_by(email_address: params[:email_address])
    if @user.password == params[:password]
      session[:user_id] = @user.id
    else
      redirect_to root_path
    end
  end

  def destroy
    session[:user_id] = @user.id
    redirect_to root_path
  end
end
