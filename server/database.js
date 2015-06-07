/**
 * This file is part of the NovaeCalc project.
 *
 * It is permitted to use, redistribute and/or modify this software
 * under the terms of the MIT License
 *
 * @author Felix Maier <maier.felix96@gmail.com>
 * @copyright (c) 2015 Felix Maier, @felixmaier
 *
 * You may not change or remove these lines
 *
 */

"use strict";

  /**
   * Database class
   * Database helper
   * @param {object} mongodb
   */
  function Database(mongo) {

    this.mongodb = mongo;

    this.dbClient = null;

    this.rooms = null;

    this.instance = null;

    this.ready = false;

    /**
     * Precompile regex
     *
     * @member {object}
     */
    this.NUMBERS = /[^0-9]/g;
    /**
     * Precompile regex
     *
     * @member {object}
     */
    this.LETTERS = /[^a-zA-Z]/gi;

  };

  /**
   * Initialize the database
   * @param {object} mongo server
   * @method init
   */
  Database.prototype.init = function(server, resolve) {

    /** Async visibility fix */
    var self = this;

    /** Initialize database */
    this.instance = new this.mongodb.Db('novaecalc', server, {});

    var instance = this.instance;

    /** Open database */
    instance.open(function (error, client) {

      if (error) throw error;

      self.dbclient = client;

      self.dbclient.createCollection('rooms', function(){
        self.rooms = new self.mongodb.Collection(self.dbclient, 'rooms');
        self.rooms.ensureIndex({id: 1}, {unique:true}, function(){});
        self.rooms.ensureIndex({name: 1}, {unique:true}, function(){});
        self.rooms.ensureIndex({owner: 1}, {unique:false}, function(){});
        self.rooms.ensureIndex({token: 1}, {unique:false}, function(){});

        self.rooms.count(function(err, count) {
          console.log('Registered rooms: '+count);
        });

        resolve(1);

      });

      /** In ready state */
      self.ready = true;

    }, {strict:true});

  };

  /**
   * Insert into the database
   * @param {string} collection name
   * @param {object} data
   * @param {number} callback
   * @method insertCollection
   */
  Database.prototype.insertCollection = function(collection, data, resolve) {

    /** Async visibility fix */
    var self = this;

    /** Database in ready state */
    if (this.ready && this[collection] && data) {

      if (this[collection] !== undefined && this[collection] !== null) {
        /** Check if already exists */
        this[collection].find({name: data.name}, {limit: 1}).count(function(error, count) {
          if (error) {
            console.warn(err.message);
            resolve(0);
            return void 0;
          }
          /** Already exists */
          if (count > 0) {
            resolve(0);
            return void 0;
          } else {
            /** Insert */
            data.cells = {};
            self[collection].insert(data, {safe: true}, function(error, objects) {
              /** Error */
              if (error) {
                console.log(error.err);
                resolve(0);
              }
              /** Success */
              else resolve(data._id);
            });
          }
        });
      } else resolve(0);

    } else resolve(0);

  };

  /**
   * Get from the database
   * @param {string} collection name
   * @param {object} data
   * @param {number} callback
   * @method getCollection
   */
  Database.prototype.getCollection = function(collection, data, resolve) {

    /** Async visibility fix */
    var self = this;

    var result = null;

    /** Database in ready state */
    if (this.ready && this[collection] && data) {

      if (this[collection] !== undefined && this[collection] !== null) {

        this[collection].find(data, {limit: 1}).count(function(error, count) {
          if (error) {
            console.warn(err.message);
            resolve(0);
            return void 0;
          }
          /** Exists */
          if (count > 0) {
            self[collection].findOne(data, function(error, object) {
              result = object;
              resolve({data: result});
            });
          } else resolve(0);
        });

      }

    }

  };

  /**
   * Update the database
   * @param {string} collection name
   * @param {object} data
   * @param {number} callback
   * @method updateCell
   */
  Database.prototype.updateCell = function(collection, data, id, resolve) {

    /** Async visibility fix */
    var self = this;

    /** Database in ready state */
    if (this.ready && this[collection] && data) {

      if (this[collection] !== undefined && this[collection] !== null) {

        var node = {};

        for (var ii in data.cells) {

          for (var cell in data.cells[ii]) {

            node["cells." + ii + "." + cell] = data.cells[ii][cell];

            self[collection].update({_id: id}, {$set: node }, function() {});

          }

        }

      }

    }

  };

  module.exports = Database;