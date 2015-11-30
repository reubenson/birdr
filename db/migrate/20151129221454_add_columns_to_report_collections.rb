class AddColumnsToReportCollections < ActiveRecord::Migration
  def change
    add_column :report_collections, :location, :string
    add_column :report_collections, :latitude, :float
    add_column :report_collections, :longitude, :float
  end
end
