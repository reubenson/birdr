class CreateWatchlistItems < ActiveRecord::Migration
  def change
    create_table :watchlist_items do |t|
      t.integer :user_id
      t.integer :bird_id
      t.timestamps null: false
    end
  end
end
