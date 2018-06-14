Safety Map of Areas in Baton Rouge

I used a combination of Open Data BR sources and EBRGIS Open Data
This lead to an issue of one particular district lacknig crime data.

This project includes a python stript for combining the two databases together. Right now 
the project has two local copies of the databases but I left untested code in the python script
to pull the databases and use an online version instead.

Issues right now include my inability to parse a json dictionary in javascript so I cannot show individal crime scoring
on the map despite that data being present in my combined version

Another issue is the ethnical dilemma of ranking crimes numerically. I have my current ranking in the python script right now for 
demo purposes but it we should decide on a more thought out system to rank crimes some time in the future. A side note that might not 
be apparent in my python script at first. I add one point if the crime was committed compared to attempted. 