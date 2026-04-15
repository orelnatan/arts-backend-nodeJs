
# Integration frontend with backend using NodeJs and MySqlWorkbench step by step guide(For localhost on MacOS system).

# Step 1 - Install and run MySQL.
    - Install Homebrew first(by https://brew.sh/)
        * Run the command: /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

    - Then, install MySQL using Homebrew(by https://flaviocopes.com/mysql-how-to-install/)
        * Run the command: brew install mysql
            - If you still get `zsh: command not found: brew`, follow this link: (search for the solution under the title: "for this error zsh: command not found: brew")
            https://stackoverflow.com/questions/36657321/after-installing-homebrew-i-get-zsh-command-not-found-brew

            - And try again "brew install mysql" 

        * Run the command: brew services start mysql
    
# Step 2 - Download, install and run MySqlWorkbench.

    - you can download it from: https://dev.mysql.com/downloads/workbench/ after sigh in to "Oracle accunt" and filling the simple form:
    * Industry
    * Job Function
        ...
    * Submit form.

# Step 3 - Create your database and tables.
    ...

# Step 4 - Run the beckend!.

    - Go to your backend(server) folder, in terminal use the command "node index.js".

    - In case you Hit "Access denied for user 'root'@'localhost' (using password: YES)" error, follow the next steps:

    On Mac: (by: https://stackoverflow.com/questions/18339513/access-denied-for-user-root-mysql-on-mac-os, search for text "The solution of")
    * Go to MySqlWorkbanch and run the following commands:
        * UPDATE user SET authentication_string=PASSWORD("my_password") WHERE User='root';
        * FLUSH PRIVILEGES;
        * ALTER USER 'root'@'localhost' IDENTIFIED BY 'MyNewPassword';

    * Hit save. and try again "node index.js".

    - In case you got the following error object:
    "Error : {
        "errno": -61,
        "code": "ECONNREFUSED",
        "syscall": "connect",
        "address": "::1",
        "port": 3306,
        "fatal": true
    }"

    * Change the field "host" in "sqlConnection" object in "index.js" file, to have the same value as in the "Host" field under the    "Connection Details" section in the my-sql-workbanch app (open my-sql-workbanch enter the code "1234", find "Object Info" & "Session"  tabs, go to "Session" tab and look at the "Host" field). (in the last case it was "127.0.0.1")  

    * Hit save. and try again "node index.js".

# Step 5 - Run the frontend!.

    - use "npm run start" or "ng serve".
    - in case you hit "CORS policy" error, there are two ways to solve it:

    * use google's "Allow-Control-Allow-Origin" extension.

     -- or --
    
    * on server(backend) go to Products ==>> Backend ==>> index.js and add to this file the following lines:
            ...
        const allowCrossDomain = function(req, res, next) { 
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            res.header('Access-Control-Allow-Headers', 'Content-Type');
        
            next();
        }
        app.use(allowCrossDomain);
            ...

    * Success!!!

# Notes.

* the solution to "Access denied...bla bla bla" error is taken from "https://www.ostraining.com/blog/coding/error-1045-phpmyadmin/",      and the command "UPDATE mysql.user SET Password=PASSWORD("EnterYourPasswordHere") WHERE User="root";" is old and not relevant anymore,  so instead you can use "Update user set authentication_string=password('EnterYourPasswordHere') where user='root';". this command is    taken from https://stackoverflow.com/questions/30692812/mysql-user-db-does-not-have-password-columns-installing-mysql-on-osx.
