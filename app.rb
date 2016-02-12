$LOAD_PATH.unshift("#{File.dirname(__FILE__)}/lib")

require 'rubygems'
require 'sinatra'
require 'thin'
require 'pri_node'
require 'json'

##
# App class
#
class App < Sinatra::Base

  def initialize
    super
    # Manage nodes data
    @n = PRI_Frutas::Node.new
  end

  get "/" do
   erb :index
  end

  get "/feed" do
    return @n.get_all().to_a().to_json
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