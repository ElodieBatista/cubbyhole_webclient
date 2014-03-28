cubbyhole_webclient
===================

# Getting started

Git bash on the "app" folder

	node web-server.js

Launch browser at 
	
	http://localhost:8000/index.html

Check out the file explorer at

    http://localhost:8000/webapp.html

# Changing IP Addresses

Go to /src/lib/custom/index-init.js & replace line 2

	var srvEndpoint = 'http://localhost:3000';

Go to /src/app.js & replace lines 11 and 12

	.constant('conf', {
    		'epApi': 'http://localhost:3000',
    		'epWeb': 'http://localhost:8000'
  	})