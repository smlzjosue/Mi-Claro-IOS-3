var app = app || {};

$(function() {

	// Home View
	// ---------------
	
	app.TemplateManager = {
		templates: {},
	
		get: function(id, callback){
			var template = this.templates[id];
			
			if (template) {
				callback(template);
			} else {
				var self = this;
				if(id!==undefined){
				$.get('templates/' + id + '.html', function(template){					
					var $tmpl = $($.trim(template));
					self.templates[id] = $tmpl;
				    callback($tmpl);
				 });
				}
			}
	
		},
  
        preload: function(callback){
        	
        	var self = this;
        	var count = 0;
        	var total = this.count(app.views);
        	
            $.each(app.views, function(index, view){
                
            	var appView = new view();            				
                
            	if(appView.name!==undefined){
					$.get('templates/' + appView.name + '.html', function(template){
						
						var $tmpl = $($.trim(template));					
						self.templates[appView.name] = $tmpl;					
						if(count==total-1){						
							callback();
						}
						count++;
					 });
            	}
            });
  
        },
        
        count: function(items){
        	var count = 0;
        	
        	$.each(items, function(key, value){
        		count++;
        	});
        	
        	return count;
        }
	
	};
});