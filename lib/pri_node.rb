require 'redis'

module PRI_Frutas

	class Node

		def initialize
			@redis = Redis.new(:host => 'localhost', :port => 6379)
		end
	
		def get_all
			all = @redis.hgetall 'pri_nodes'
		end

		def get_upd_time
			time = @redis.get 'pri_upd_time'
		end

		def push_cmd cmd
			@redis.lpush 'pri_cmd', cmd.to_s
		end
	end

end