// The User Data Access Object (DAO). Encapsulates logic (in this case SQL statements) to access user data.

$(function(){
	
	app.UserDAO = function(db) {
		console.log('init USERDAO');
	    this.db = db;
	    this.tableName = 'user'
	};
	
	_.extend(app.UserDAO.prototype, {
		
		deleteUserInfo: function(login) {
			
			console.log('deleteUserInfo');
			
            var self = this;
	    	this.db.transaction(function(tx){
				tx.executeSql('DELETE FROM `'+self.tableName+'` WHERE login=?',
					[login],
					function(tx, results){
                        //callback(results);						
					});	    
				},
				function(error){
		           	console.log('findAll error code='+error.code+' message='+error.message);
                    return false;
				}
	    	);	
	    },
		
		
		findCurrent: function(callback) {
            var self = this;
	    	this.db.transaction(function(tx){
				tx.executeSql('SELECT * FROM `'+self.tableName+'` WHERE id > 0 ORDER BY id DESC ',
					[],
					function(tx, results){
                        callback(results.rows.length >= 1 ? results.rows.item(0) : null);						
					});	    
				},
				function(error){
		           	console.log('findAll error code='+error.code+' message='+error.message);
                    return false;
				}
	    	);	
	    },
		
		findById: function(id, callback) {
            var self = this;
	    	this.db.transaction(function(tx){
				tx.executeSql('SELECT * FROM `'+self.tableName+'` WHERE id=?',
					[id],
					function(tx, results){
                        callback(results.rows.length === 1 ? results.rows.item(0) : null);						
					});	    
				},
				function(error){
		           	console.log('findAll error code='+error.code+' message='+error.message);
                    return false;
				}
	    	);	
	    },
	    
	    findAll: function(callback) {
            var self = this;
	    	this.db.transaction(function(tx){
				tx.executeSql('SELECT * FROM `'+self.tableName+'` ORDER BY id DESC',
					[],
					function(tx, results){	
						var len = results.rows.length,
							users = []; 
						for(var i=0 ; i<len ; i++){
							users[i] = results.rows.item(i);
						}
						callback(users);
					});	    
				},
				function(error){
		           	console.log('findAll error code='+error.code+' message='+error.message);
                    return false;
				}
	    	);  	
	    },
        
	    insertAndDeleteOther: function(model){
	    	console.log("DAO insert ");
	    	console.log(model.attributes.login);
	    	
	    	this.deleteUserInfo(model.attributes.login);
	    	
	    	var self = this;
            var keys = new Array(),
                values = new Array();
             
            $.each(model.attributes, function(key,value){
                keys.push('`'+key+'`');
                values.push('"'+value+'"');
            });             

	    	this.db.transaction(function(tx){
    			tx.executeSql('INSERT INTO `'+self.tableName+'` ('+keys.toString()+') VALUES ('+values.toString()+')',
    					[], //model.id, model.name, model.description, model.version, model.logo, model.installed, model.enabled
    					function(tx, results){    						
                    		console.log('create success');
    					});                        
	    		},
	    		function(error){
		           	console.log('create error code='+error.code+' message='+error.message);
                    return false;
	            }
	    	);
	    },
        
	    update: function(model){
	    	var self = this;
            var id = (model.attributes[model.idAttribute] || model.attributes.id);
            var attributes = new Array();            

            $.each(model.attributes, function(key,value){
                attributes.push('`'+key+'`="'+value+'"');
            });
            
	    	this.db.transaction(function(tx){
                tx.executeSql('UPDATE `'+self.tableName+'` SET '+attributes.toString()+' WHERE(`id`=?)',
                    [model.attributes.id],
                    function(tx, results){
                        console.log('update success');
                    },
                    function(error){
                        console.log('update error code='+error.code+' message='+error.message);
                    }
	            );
	    		
            });
	    },               
	
	    // Populate User table 
	    populate: function(callback) {
	    	console.log("populate");
	    	console.log(this.db);
	    	var self = this;
	    	
	        this.db.transaction(
	            function(tx) {
	                //console.log('Dropping `'+self.tableName+'` table');
	                //tx.executeSql('DROP TABLE IF EXISTS `'+self.tableName+'`');
	                
	                var sql =
	                    'CREATE TABLE IF NOT EXISTS `'+self.tableName+'` ( ' +
	                    'id INTEGER PRIMARY KEY UNIQUE, ' +
	                    'token VARCHAR(50), ' +
	                    'login TEXT, ' +
	                    'password VARCHAR(50), ' +
	                    'enabled TINYINT(1)) ';
	                console.log('Creating user table');
	                tx.executeSql(sql);	               
	            },
	            function(tx, error) {
	                console.log('Transaction error ' + error);
	            },
	            function(tx) {
	            	console.log('DAO other function');
	                callback();
	            }
	        );
	    },
        
        success:  function (tx, res) {
            var len = res.rows.length,result, i;
            if (len > 0) {
                result = [];

                for (i=0;i<len;i++) {
                    result.push(JSON.parse(res.rows.item(i).value));
                }
            }
		
            options.success(result);
        },
        
        error: function (tx,error) {
            window.console.error("sql error");
            window.console.error(error);
            window.console.error(tx);
            options.error(error);
        }        
	});
	
});