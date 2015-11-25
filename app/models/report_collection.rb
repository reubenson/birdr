class ReportCollection < ActiveRecord::Base
  has_many :reports

  def centroid
    lats = []
    lngs = []
    self.reports.each do |report|
      lats << report.lat
      lngs << report.lng
    end

    [ lats.inject{|sum,lat| sum+lat}/lats.length , lngs.inject{|sum,lng| sum+lng}/lngs.length ]
  end
end
