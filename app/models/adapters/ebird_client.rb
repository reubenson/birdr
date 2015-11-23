module Adapters
	class EbirdClient
		def connection
			@connection = Adapters::EbirdConnection.new
		end

		def find_by_species(species)
			results = connection.query(species)
			# random_gif = results.data.sample
			# "https://media.giphy.com/media/#{random_gif.id}/giphy.gif"
		end
	end
end