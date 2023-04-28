from scipy.sparse import csr_matrix
import numpy as np
import pandas as pd
from sklearn.preprocessing import LabelEncoder
from multiprocessing import Pool, cpu_count

class EASE:
	def __init__(self):
		self.user_enc = LabelEncoder()
		self.item_enc = LabelEncoder()

	def _get_users_and_items(self, df):
		users = self.user_enc.fit_transform(df.loc[:, 'user_id'])
		items = self.item_enc.fit_transform(df.loc[:, 'item_id'])
		return users, items

	def fit(self, df, lamb = 0.5, implicit=True):
		users, items = self._get_users_and_items(df)
		values = (
			np.ones(df.shape[0])
			if implicit
			else df['rating'].to_numpy() / df['rating'].max()
		)

		X = csr_matrix((values, (users, items)))
		self.X = X

		G = X.T.dot(X).toarray()
		diagIndices = np.diag_indices(G.shape[0])
		G[diagIndices] += lamb
		P = np.linalg.inv(G)
		B = P / (-np.diag(P))
		B[diagIndices] = 0

		self.B = B
		self.pred = X.dot(B)

	def predict_k(self, u, k):
		scores = self.X[u, :] @ self.B
		return np.argsort(-scores)[:, :k]

	@staticmethod
	def predict_for_user(user, group, pred, items, k):
		watched = set(group['ci'])
		candidates = [item for item in items if item not in watched]
		pred = np.take(pred, candidates)
		res = np.argpartition(pred, -k)[-k:]
		r = pd.DataFrame(
			{
				"user_id": [user] * len(res),
				"item_id": np.take(candidates, res),
				"score": np.take(pred, res),
			}
		).sort_values('score', ascending=False)
		return r
