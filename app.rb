$LOAD_PATH.unshift("#{File.dirname(__FILE__)}/lib")

require 'rubygems'
require 'sinatra'
require 'thin'
require 'pri_node'
require 'json'
require 'tilt/erb'
require 'db'

##
# App class
#
class App < Sinatra::Base

  def initialize
    super
    # Manage nodes data
    @n = PRI_Frutas::Node.new
    @db = Db.new 'pri_data', 'sensor_data'
  end

  get "/" do
   erb :index
  end

  get "/api/data/fast" do
    id = params[:_id]
    id = id.to_i unless id.nil?
    JSON.generate @db.get_last_hour :fast, id
  end

  get "/api/data/slow" do
    id = params[:_id]
    id = id.to_i unless id.nil?
    JSON.generate @db.get_last_hour :slow, id
  end

  ## API for Nodes
  get '/api/nodes' do
    _db = @db.get_db
    res = []
    cursor = _db[:nodes].find({})
    cursor.each do |doc|
      res << doc
    end
    return res.to_json
  end

  get '/api/nodes/:id' do
    id = params[:id]
    _db = @db.get_db
    res = []
    cursor = _db[:nodes].find({id: id.to_i})
    cursor.each do |doc|
      res << doc
    end
    return res[0].to_json unless res.count == 0
    halt 404
  end

  post '/api/nodes' do
    data = JSON.parse request.body.read
    if data
      _db = @db.get_db
      res = _db[:nodes].insert_one(data)
      halt 500 unless res.successful?
      status 201
      data.to_json 
    end
  end

  put '/api/nodes/:id' do
    # body = JSON.parse request.body.read
    # t = Task.get(params[:id])
    # if t.nil?
    #   halt(404)
    # end
    # halt 500 unless Task.update(
    #   title:      body['title'],
    #   director:   body['director'],
    #   year:       body['year'] 
    #   )
    # t.to_json
    halt 404
  end

  delete '/api/nodes/:id' do
    # t = Task.get(params[:id])
    # if t.nil?
    #     halt 404
    # end
    # halt 500 unless t.destroy
    halt 404
  end
  ## END API for Nodes

  get "/*" do
    erb :index
  end

end


dispatch = Rack::Builder.app do
  map '/' do
    run App.new
  end
end

# Start the web server. Note that you are free to run other tasks
# within your EM instance.
Rack::Server.start({
  app:    dispatch,
  server: 'thin',
  Host:   '0.0.0.0',
  Port:   '4567',
  signals: false,
})