require 'sinatra'

module PRI
  module API_Nodes

  include Sinatra

  get '/api/nodes' do
    _db = @db.get_db
    res = []
    cursor = _db[:nodes].find({})
    cursor.each do |doc|
      res << doc.to_json
    end
    return res
  end

  get '/api/nodes/:id' do
    id = params[:id]
    _db = @db.get_db
    res = []
    cursor = _db[:nodes].find({id: id})
    cursor.each do |doc|
      res << doc.to_json
    end
    return res unless res.count == 0
    halt 404
  end

  post '/api/nodes' do
    body = JSON.parse request.body.read
    puts body
    # if body.data
    #   _db = @db.get_db
    #   res = _db[:nodes].insert_one(data)
    #   puts res
    #   status 201
    #   body.data.to_json 
    # end
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
  
  end
end