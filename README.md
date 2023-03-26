# ICS2CSV  ICS2XLS  ICS2EXCEL
node js script that turn a ICS calander to csv .


to run the script you will need to download and use nodejs and npm , 

first install the dependenci like that.

npm install express body-parser multer fs ical iconv-lite

the run the app with this command.

node app.js



or you can just download the executable .


the script will run a local web page on port 3000 , to enter the page go to ur browser and enter

http://localhost:3000


you will be greated with this page

![image](https://user-images.githubusercontent.com/17353839/227762323-264be51b-e04c-473d-b2f2-00ccd2f79e14.png)


enter a URL of an ICS file or upload ur own .


the converted csv file will be downloaded .


![image](https://user-images.githubusercontent.com/17353839/227762534-5177282e-fce9-4cc1-acd6-d58da77bf6e9.png)



headers of the csv will be 


Summary	Start Date	End Date	Start Time	End Time	Total Hours
![image](https://user-images.githubusercontent.com/17353839/227762557-00818590-6cec-41ce-a237-683642ab6a75.png)


enjoy




NOTE


for windows Users below win 8.1 you will need to create 2 Environment Variables if NODE_PATH is not installed .


Go to System-Properties (run: systempropertiesadvanced.exe), in Advanced tab, click Environment Variables.

Still on the System variables, click 'New', add "NODE_PATH" with value "C:\nodejs64\node_modules" , and click OK.

click 'New' again, add "NODE_SKIP_PLATFORM_CHECK" with value "1", and click OK.

and run the exe.
