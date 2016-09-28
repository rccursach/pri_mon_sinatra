require 'mongo'
require 'pp'

class Db

  def initialize db_name, col_name
    @db = Mongo::Client.new([ '127.0.0.1:27017' ], :database => db_name)
    @collection = col_name.to_sym
    pp @collection
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

  def get_last_hour pkg_type
    t = Time.at(Time.now.to_i - 3600).to_i
    k = ''
    ftype = ''

    if pkg_type == :fast
      k = 'time'
      ftype = 'F1'
    elsif pkg_type == :slow
      k = 'rtc_time'
      ftype = 'S1'
    end

    begin
      res = []
      cursor = @db[@collection].find({'$and' => [{k => { '$gt' => t }}, {:ftype => ftype}]}, { :projection => {:_id => 0} })
      cursor.each do |doc|
        res << doc.to_json
      end
      return res
    rescue => e
      puts e.message
    end
  end

end