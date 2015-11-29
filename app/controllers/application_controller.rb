class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  def root
    # deprecate this action?
  	bird_connection = Adapters::EbirdConnection.new
    reports = bird_connection.query("Strix Varia")
    @collection = ReportCollection.new
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

    @centroid = @collection.centroid
  end

end
