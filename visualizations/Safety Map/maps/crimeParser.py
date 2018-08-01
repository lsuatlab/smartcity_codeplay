import json
from pprint import pprint
import requests
import ast

crimeRatings = {
	"RESIDENTAL BURGLARY" : 7,
	"THEFT" : 7,
	"OTHER" : 2,
	"VEHICLE BURGLARY" : 7,
	"BATTERY" : 15,
	"SEXUAL ASSAULT" : 10,
	"NARCOTICS" : 5,
	"FIREARM" : 7,
	"ASSAULT" : 10,
	"CRIMINAL DAMAGE TO PROPERTY" : 4,
	"INDIVIDUAL ROBBERY" : 7, 
	"NUISANCE" : 3, 
	"NON-RESIDENTIAL BURGLARY" : 7, 
	"JUVENILE" : 2,
	"BUSINESS ROBBERY" : 7, 
	"HOMICIDE" : 20
}
#cData = json.load(requests.get("https://data.brla.gov/resource/5rji-ddnu.json"))
#dData = json.load(requests.get("https://maps.brla.gov/gis/rest/services/Governmental_Units/Police_District/MapServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=geojson"))
with open("crimeData.js", "r") as read_file:
    cData = json.load(read_file)
with open("districts.js", "r") as read_file:
    dData = json.load(read_file)
file = open("tester.js", "w")
#pprint(crime)
crimeDict = {}
for i in range(len(cData)):	
	name = cData[i].get("complete_district", "none")[:2] + "-" + cData[i].get("complete_district", "none")[2:]
	if(name not in crimeDict):
		crimeDict[name] = {"TOTAL": 0}
	crimeDict[name]["TOTAL"] = int(crimeDict[name].get("TOTAL", 0)) + int(crimeRatings.get(cData[i].get("crime", "NONE"), 0)) + (1 if (cData[i].get("a_c", "none") == "COMMITTED") else 0)
	crimeDict[name][cData[i].get("crime")] = crimeDict[name].get(cData[i].get("crime"), 0) + 1
for j in range(len(dData.get("features", "none"))):
	name = (dData.get("features")[j].get("properties", "none").get("POLICE_DISTRICT_NO", "none"))
	if(name in crimeDict):
		dData.get("features")[j].get("properties", "none")["CRIME_INDEX"] = crimeDict[name]
	else:
		dData.get("features")[j].get("properties", "none")["CRIME_INDEX"] = {"TOTAL": 0}

for i in crimeDict:
	print(i + ": " + str(crimeDict[i]))
file.write("var crimeData = ")
file.write(json.dumps(dData, indent=4))