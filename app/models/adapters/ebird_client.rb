module Adapters
	class EbirdClient
		def connection
			@connection = Adapters::EbirdConnection.new
		end

		def find_by_species(species)
			results = connection.species_query(species)
			# random_gif = results.data.sample
			# "https://media.giphy.com/media/#{random_gif.id}/giphy.gif"
		end

		def find()
			results = connection.location_query()
			# random_gif = results.data.sample
			# "https://media.giphy.com/media/#{random_gif.id}/giphy.gif"
		end

	end
end
