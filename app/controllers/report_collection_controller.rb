class ReportCollectionController < ApplicationController
  def new
    @collection = ReportCollection.new
  end

  def create
    # @collection = ReportCollection.create(collection_params)
    @collection = ReportCollection.create

    bird_connection = Adapters::EbirdConnection.new
    @lat = 40.65
    @lng = -73.96
    reports = bird_connection.location_query(@lat,@lng)
    # binding.pry
    # @collection = ReportCollection.new
    reports.each do |r|
      @collection.reports.build({
        obs_dt: r[:obsDt],
        lng: r[:lng],
        lat: r[:lat],
        how_many: r[:howMany],
        com_name: r[:comName],
        sci_name: r[:sciName]
      });
    end

    @collection.save if reports.length>0
    # binding.pry
    # @collection = @collection.search_species(collection_params[:query])

    @centroid = @collection.centroid

    render 'application/root'
  end
end

private

def collection_params
  params.require(:report_collection).permit(:query)
end
