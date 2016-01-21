class BirdController < ApplicationController

  def sci_name
    searched_name = params[:searched_name]
    csv = CSV.read("public/ebird_taxa.csv")
    csv.shift
    common_names = csv.map{|row| row[1]}
    sci_names = csv.map{|row| row[0]}
    common_names.each_with_index do |name,i|
      if name.match(/#{searched_name}/i)
        render text: sci_names[i]
        return
      end
    end
  end
end
