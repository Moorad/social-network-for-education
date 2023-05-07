import pymongo
import os
import pandas as pd
import numpy as np
import array
from model import EASE
from dotenv import load_dotenv


load_dotenv()

DB_NAME = os.getenv("DB_NAME")[1:] # Remove the leading "/"
DB = os.getenv("DB")

db_client = pymongo.MongoClient(DB)

if (not DB_NAME in db_client.list_database_names()):
	raise Exception("A database with the name " + DB_NAME + " does not exist in the current database")

db = db_client[DB_NAME]

print("Connected successfully to " + DB)

user_id_mapping = {}
post_id_mapping = {}

def fetch_posts():
	posts = db["posts"].find()
	
	return posts

def parse_interactions(posts):
	df = pd.DataFrame(columns=["user_id", "item_id", "rating"])

	post_id_index = 0	
	user_id_index = 0
 
	for post in posts:
		post_id_mapping[str(post_id_index)] = str(post["_id"])
	 
		for user in post["views"]:
			score = 0.0
   
			if (user in post["likes"]):
				score = 1.0 

			if (not str(user) in user_id_mapping.values()):
				user_id_mapping[str(user_id_index)] = str(user)
				user_id_index += 1

			user_id = list(user_id_mapping.keys())[list(user_id_mapping.values()).index(str(user))]      
   			
			data = {
					"user_id": [user_id],
					"item_id": [post_id_index],
					"score": [score],
				} 
			df = pd.concat(pd.DataFrame(data=data))
   
		post_id_index += 1
	
	# print(post_id_mapping)
	# print(user_id_mapping)
	return df

def all_post_ids(posts):
	ids = []
	
	for post in posts:
		ids.append(str(post["_id"]))

	return ids

posts = fetch_posts()
interactions = parse_interactions(posts)

ease_model = EASE()

ease_model.fit(interactions)

print(interactions)

predictions = ease_model.predict(interactions, [2], interactions["item_id"].unique(), 10)

# pd.array([int(id) for id in list(post_id_mapping.keys())], dtype='Int64')