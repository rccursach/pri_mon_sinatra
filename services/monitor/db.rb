require 'mongo'
require 'pp'

class Db

  def initialize db_name, col_name
    Mongo::Logger.logger.level = ::Logger::FATAL
    @db = Mongo::Client.new([ '127.0.0.1:27017' ], :database => db_name)
    @collection = col_name.to_sym
  end

  def insert_many data 
    begin
      @db[@collection].insert_many(data)
    rescue => e
      puts e.message
    end
  end

  def insert_one data 
    begin
      @db[@collection].insert_one(data)
    rescue => e
      puts e.message
    end
  end

end