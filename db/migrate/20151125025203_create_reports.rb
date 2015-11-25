class CreateReports < ActiveRecord::Migration
  def change
    create_table :reports do |t|
      t.date :obs_dt
      t.float :lat
      t.float :lng
      t.string :loc_name
      t.boolean :obs_valid
      t.string :com_name
      t.boolean :obs_reviewed
      t.string :sci_name
      t.boolean :location_private
      t.integer :how_many
      t.string :loc_id
      t.integer :report_collection_id
      # t.timestamps null: false
    end
  end
end
