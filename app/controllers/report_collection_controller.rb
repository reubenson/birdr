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
      if valid_species(r.comName)
        @collection.reports.build({
          obs_dt: r[:obsDt],
          lng: r[:lng],
          lat: r[:lat],
          how_many: r[:howMany],
          com_name: r[:comName],
          sci_name: r[:sciName]
        });
      end
    end

    @collection.save if reports.length>0
    # binding.pry
    # @collection = @collection.search_species(collection_params[:query])

    @centroid = @collection.centroid

    render 'application/root'
  end
end

private

def valid_species(name)
  # eBird allows non-specific taxanomic observation data to be logged,
  # which i've chosen to exclude in populating the species list here.
  # see http://help.ebird.org/customer/portal/articles/1006768-entering-non-species-taxa
  name && !name.include?('sp.')
end

def collection_params
  params.require(:report_collection).permit(:query)
end
