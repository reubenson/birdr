class ReportCollectionController < ApplicationController

  def create
    geo_coordinates = params[:geocoordinates] ? params[:geocoordinates].split(',') : nil
    if geo_coordinates
      @collection = ReportCollection.create
      @collection.latitude = geo_coordinates[0]
      @collection.longitude = geo_coordinates[1]
    else
      location = params[:location] || ( (request.remote_ip=='::1' || request.remote_ip=='127.0.0.1') ? "Prospect Park, NY" : request.remote_ip)
      @collection = ReportCollection.create(location: location)
    end
    @collection.format_location
    @collection.query = @collection.location if params[:location]
    @collection.save

    eBirdClient = Adapters::EbirdClient.new
    @collection.reports = eBirdClient.find_by_location(@collection.latitude,@collection.longitude)
    @collection_view_object = ReportCollectionViewObject.new(@collection,params[:location])

    render 'application/root'
  end
end

private

def collection_params
  params.require(:report_collection).permit(:query)
end
