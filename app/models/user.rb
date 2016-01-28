require 'bcrypt'

class User < ActiveRecord::Base
  has_many :watchlist_items
  has_many :birds, through: :watchlist_items
  include BCrypt

  def password
    @password ||= Password.new(password_hash)
  end

  def password=(new_password)
    @password = Password.create(new_password)
    self.password_hash = @password
  end

end
